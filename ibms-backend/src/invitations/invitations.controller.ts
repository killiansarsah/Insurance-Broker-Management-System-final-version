import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service.js';
import { CreateInvitationDto } from './dto/create-invitation.dto.js';
import { AcceptInvitationDto } from './dto/accept-invitation.dto.js';
import { InvitationQueryDto } from './dto/invitation-query.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import type { Response } from 'express';

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict' as const,
    path: '/api/v1/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller('invitations')
export class InvitationsController {
    constructor(private invitations: InvitationsService) { }

    @Post()
    @Roles('TENANT_ADMIN', 'ADMIN')
    async create(
        @Body() dto: CreateInvitationDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.invitations.create(
            user.tenantId,
            user.sub,
            user.role,
            dto,
        );
    }

    @Get()
    @Roles('TENANT_ADMIN', 'ADMIN')
    async findAll(
        @Query() query: InvitationQueryDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.invitations.findAll(user.tenantId, query);
    }

    @Delete(':id')
    @Roles('TENANT_ADMIN', 'ADMIN')
    async revoke(
        @Param('id') id: string,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.invitations.revoke(id, user.tenantId, user.sub);
    }

    @Public()
    @Get('validate/:token')
    async validate(@Param('token') token: string) {
        return this.invitations.validate(token);
    }

    @Public()
    @Post('accept')
    async accept(
        @Body() dto: AcceptInvitationDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.invitations.accept(dto);
        res.cookie('refreshToken', result.refreshRaw, REFRESH_COOKIE_OPTIONS);
        return { accessToken: result.accessToken, user: result.user };
    }
}
