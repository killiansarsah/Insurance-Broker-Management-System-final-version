import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatRoomDto, AddParticipantDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser {
  user: { tenantId: string; sub: string; role: string };
}

@Controller('api/v1/chat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'TENANT_ADMIN', 'BROKER', 'VIEWER')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('rooms')
  createRoom(@Request() req: RequestWithUser, @Body() dto: CreateChatRoomDto) {
    return this.chatService.createRoom(req.user.tenantId, req.user.sub, dto);
  }

  @Get('rooms')
  listRooms(@Request() req: RequestWithUser) {
    return this.chatService.listRooms(req.user.tenantId, req.user.sub);
  }

  @Get('rooms/:id/messages')
  getMessages(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Query('before') before?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getMessages(
      id,
      req.user.tenantId,
      req.user.sub,
      before,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Post('rooms/:id/participants')
  addParticipant(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: AddParticipantDto,
  ) {
    return this.chatService.addParticipant(id, req.user.tenantId, dto.userId);
  }

  @Delete('rooms/:id/participants/:userId')
  removeParticipant(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.chatService.removeParticipant(id, req.user.tenantId, userId);
  }
}
