import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: process.env['CORS_ORIGINS']?.split(',') || [
      'http://localhost:3000',
    ],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // userId -> Set of socket IDs
  private readonly userSockets = new Map<string, Set<string>>();

  private extractToken(client: Socket): string | undefined {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken.trim().length > 0) {
      return authToken.trim();
    }

    const queryToken = client.handshake.query?.token;
    if (typeof queryToken === 'string' && queryToken.trim().length > 0) {
      return queryToken.trim();
    }

    const authHeader = client.handshake.headers?.authorization;
    if (typeof authHeader === 'string' && authHeader.trim().length > 0) {
      return authHeader.replace(/^Bearer\s+/i, '').trim();
    }

    return undefined;
  }

  handleConnection(client: AuthenticatedSocket) {
    try {
      const token = this.extractToken(client);

      if (!token) {
        this.logger.debug(
          `Notification socket rejected: missing token (socket: ${client.id})`,
        );
        client.disconnect(true);
        return;
      }

      let publicKey: string;
      try {
        const keyPath =
          process.env.JWT_ACCESS_PUBLIC_KEY_PATH ??
          path.join(process.cwd(), 'keys', 'access_public.pem');
        publicKey = fs.readFileSync(keyPath, 'utf8');
      } catch {
        this.logger.error('Failed to read JWT public key');
        client.disconnect(true);
        return;
      }

      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as { sub: string; tenantId: string };

      client.data.userId = payload.sub;
      client.data.tenantId = payload.tenantId;

      // Join a user-specific room for targeted delivery
      void client.join(`user:${payload.sub}`);

      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub).add(client.id);

      this.logger.log(
        `Notification socket connected: ${client.id} (user: ${payload.sub})`,
      );
    } catch {
      this.logger.debug(
        `Notification socket rejected: invalid JWT (socket: ${client.id})`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.data?.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.logger.log(`Notification socket disconnected: ${client.id}`);
      return;
    }

    // Unauthenticated disconnects are expected when clients connect without/with stale tokens.
    this.logger.debug(
      `Notification socket disconnected before auth: ${client.id}`,
    );
  }

  /**
   * Push a notification to a specific user in real-time.
   * Called by NotificationsService when a new notification is created.
   */
  sendToUser(
    userId: string,
    notification: {
      id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      link?: string;
      createdAt: Date;
    },
  ) {
    this.server.to(`user:${userId}`).emit('new_notification', notification);
  }
}
