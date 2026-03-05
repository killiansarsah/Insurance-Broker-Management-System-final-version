import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    tenantId: string;
  };
}

// Track online users: userId -> set of socket IDs
const onlineUsers = new Map<string, Set<string>>();

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) { }

  handleConnection(client: AuthenticatedSocket) {
    try {
      const token: string | undefined =
        (client.handshake.auth?.token as string | undefined) ??
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.disconnect();
        return;
      }

      // Read public key for JWT verification
      let publicKey: string;
      try {
        const keyPath =
          process.env.JWT_ACCESS_PUBLIC_KEY_PATH ??
          path.join(process.cwd(), 'keys', 'access_public.pem');
        publicKey = fs.readFileSync(keyPath, 'utf8');
      } catch {
        this.logger.error('Failed to read JWT public key');
        client.disconnect();
        return;
      }

      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as {
        sub: string;
        tenantId: string;
      };

      client.data.userId = payload.sub;
      client.data.tenantId = payload.tenantId;

      // Track presence
      if (!onlineUsers.has(payload.sub)) {
        onlineUsers.set(payload.sub, new Set());
        // First socket for this user — broadcast online
        this.server.emit('user_online', { userId: payload.sub });
      }
      onlineUsers.get(payload.sub)!.add(client.id);

      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);
    } catch {
      this.logger.warn(`Connection rejected: invalid JWT`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.data?.userId;
    if (userId) {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          this.server.emit('user_offline', { userId });
        }
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string },
  ) {
    const { userId, tenantId } = client.data;
    try {
      await this.chatService.findRoomById(data.roomId, tenantId, userId);
      void client.join(data.roomId);

      // Send recent messages
      const messages = await this.chatService.getMessages(
        data.roomId,
        tenantId,
        userId,
        undefined,
        50,
      );
      client.emit('recent_messages', { roomId: data.roomId, messages });
    } catch {
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; content: string; type?: string },
  ) {
    const { userId, tenantId } = client.data;
    try {
      const message = await this.chatService.sendMessage(
        data.roomId,
        tenantId,
        userId,
        data.content,
        (data.type as 'TEXT' | 'IMAGE' | 'FILE') ?? 'TEXT',
      );

      // Broadcast to room
      this.server.to(data.roomId).emit('new_message', message);
    } catch {
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ) {
    const { userId } = client.data;
    client.to(data.roomId).emit('user_typing', {
      roomId: data.roomId,
      userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string; messageId: string },
  ) {
    const { userId, tenantId } = client.data;
    try {
      await this.chatService.markRead(data.roomId, tenantId, data.messageId);
      this.server.to(data.roomId).emit('message_read', {
        roomId: data.roomId,
        messageId: data.messageId,
        userId,
        readAt: new Date(),
      });
    } catch {
      client.emit('error', { message: 'Failed to mark read' });
    }
  }
}
