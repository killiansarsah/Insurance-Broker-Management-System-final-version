import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatRoomDto } from './dto/chat.dto';
import { ChatMessageType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CREATE ROOM ──────────────────────────────────
  async createRoom(tenantId: string, userId: string, dto: CreateChatRoomDto) {
    // For DIRECT rooms: exactly 2 participants, no duplicates
    if (dto.type === 'DIRECT') {
      if (dto.participantIds.length !== 1) {
        throw new BadRequestException(
          'DIRECT room requires exactly 1 other participant',
        );
      }
      const otherId = dto.participantIds[0];

      // Check for existing DIRECT room between these two
      const existing = await this.prisma.chatRoom.findFirst({
        where: {
          tenantId,
          type: 'DIRECT',
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: otherId } } },
          ],
        },
      });
      if (existing) {
        return this.findRoomById(existing.id, tenantId, userId);
      }
    }

    if (dto.type === 'GROUP' && !dto.name) {
      throw new BadRequestException('GROUP rooms require a name');
    }

    const room = await this.prisma.chatRoom.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
      },
    });

    // Add creator as participant
    await this.prisma.chatParticipant.create({
      data: { roomId: room.id, userId },
    });

    // Add other participants
    const uniqueIds = [
      ...new Set(dto.participantIds.filter((id) => id !== userId)),
    ];
    if (uniqueIds.length) {
      await this.prisma.chatParticipant.createMany({
        data: uniqueIds.map((id) => ({ roomId: room.id, userId: id })),
      });
    }

    return this.findRoomById(room.id, tenantId, userId);
  }

  // ─── LIST ROOMS ───────────────────────────────────
  async listRooms(tenantId: string, userId: string) {
    const rooms = await this.prisma.chatRoom.findMany({
      where: {
        tenantId,
        participants: { some: { userId } },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            type: true,
            createdAt: true,
            sender: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      type: room.type,
      participants: room.participants.map((p) => p.user),
      lastMessage: room.messages[0] ?? null,
      createdAt: room.createdAt,
    }));
  }

  // ─── GET ROOM ─────────────────────────────────────
  async findRoomById(id: string, tenantId: string, userId: string) {
    const room = await this.prisma.chatRoom.findFirst({
      where: { id, tenantId, participants: { some: { userId } } },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    if (!room) throw new NotFoundException('Room not found or access denied');
    return room;
  }

  // ─── GET MESSAGES ─────────────────────────────────
  async getMessages(
    roomId: string,
    tenantId: string,
    userId: string,
    before?: string,
    limit = 50,
  ) {
    // Verify user is participant
    const participant = await this.prisma.chatParticipant.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!participant)
      throw new ForbiddenException('Not a participant of this room');

    const where = {
      roomId,
      tenantId,
      ...(before && { createdAt: { lt: new Date(before) } }),
    };

    return this.prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100),
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  // ─── SEND MESSAGE ─────────────────────────────────
  async sendMessage(
    roomId: string,
    tenantId: string,
    senderId: string,
    content: string,
    type: ChatMessageType = 'TEXT',
  ) {
    // Verify sender is participant
    const participant = await this.prisma.chatParticipant.findUnique({
      where: { roomId_userId: { roomId, userId: senderId } },
    });
    if (!participant)
      throw new ForbiddenException('Not a participant of this room');

    return this.prisma.chatMessage.create({
      data: {
        tenantId,
        roomId,
        senderId,
        content,
        type,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  // ─── ADD PARTICIPANT ──────────────────────────────
  async addParticipant(roomId: string, tenantId: string, userId: string) {
    const room = await this.prisma.chatRoom.findFirst({
      where: { id: roomId, tenantId },
    });
    if (!room) throw new NotFoundException('Room not found');
    if (room.type === 'DIRECT') {
      throw new BadRequestException('Cannot add participants to DIRECT rooms');
    }

    return this.prisma.chatParticipant.create({
      data: { roomId, userId },
    });
  }

  // ─── REMOVE PARTICIPANT ───────────────────────────
  async removeParticipant(roomId: string, tenantId: string, userId: string) {
    const room = await this.prisma.chatRoom.findFirst({
      where: { id: roomId, tenantId },
    });
    if (!room) throw new NotFoundException('Room not found');

    const participant = await this.prisma.chatParticipant.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });
    if (!participant)
      throw new NotFoundException('Participant not found in room');

    await this.prisma.chatParticipant.delete({
      where: { id: participant.id },
    });
    return { removed: true };
  }

  // ─── MARK READ ────────────────────────────────────
  async markRead(roomId: string, tenantId: string, messageId: string) {
    return this.prisma.chatMessage.update({
      where: { id: messageId, roomId, tenantId },
      data: { readStatus: 'READ' },
    });
  }

  // ─── GET ROOM PARTICIPANT IDS ─────────────────────
  async getRoomParticipantIds(roomId: string): Promise<string[]> {
    const participants = await this.prisma.chatParticipant.findMany({
      where: { roomId },
      select: { userId: true },
    });
    return participants.map((p) => p.userId);
  }
}
