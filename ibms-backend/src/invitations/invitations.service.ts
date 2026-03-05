import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service.js';
import { canAssignRole } from '../common/constants/role-hierarchy.js';
import type { CreateInvitationDto } from './dto/create-invitation.dto.js';
import type { AcceptInvitationDto } from './dto/accept-invitation.dto.js';
import type { InvitationQueryDto } from './dto/invitation-query.dto.js';
import type { InvitationStatus } from '@prisma/client';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const PASSWORD_HASH_COST = 12;

interface InvitationRecord {
    id: string;
    tenantId: string;
    email: string;
    role: string;
    branchId: string | null;
    token: string;
    status: string;
    invitedById: string;
    expiresAt: Date;
    acceptedAt: Date | null;
    createdAt: Date;
}

@Injectable()
export class InvitationsService {
    private readonly logger = new Logger(InvitationsService.name);

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private auth: AuthService,
    ) { }

    async create(
        tenantId: string,
        inviterId: string,
        inviterRole: string,
        dto: CreateInvitationDto,
    ) {
        if (!canAssignRole(inviterRole, dto.role)) {
            throw new HttpException(
                'Cannot invite user with role higher than your own',
                HttpStatus.FORBIDDEN,
            );
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { tenantId_email: { tenantId, email: dto.email } },
        });
        if (existingUser) {
            throw new HttpException(
                'A user with this email already exists in this tenant',
                HttpStatus.CONFLICT,
            );
        }

        const pendingInvite = await this.prisma.invitation.findFirst({
            where: {
                tenantId,
                email: dto.email,
                status: 'PENDING',
            },
        });
        if (pendingInvite) {
            throw new HttpException(
                'A pending invitation already exists for this email',
                HttpStatus.CONFLICT,
            );
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

        const invitation = await this.prisma.invitation.create({
            data: {
                tenantId,
                email: dto.email,
                role: dto.role,
                branchId: dto.branchId ?? null,
                token,
                expiresAt,
                invitedById: inviterId,
            },
            include: {
                invitedBy: { select: { firstName: true, lastName: true } },
            },
        });

        const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
        this.logger.log(`Invite URL: ${frontendUrl}/accept-invite?token=${token}`);

        await this.prisma.auditLog.create({
            data: {
                tenantId,
                userId: inviterId,
                action: 'invitation.sent',
                entity: 'invitation',
                entityId: invitation.id,
                after: { email: dto.email, role: dto.role },
            },
        });

        return this.toResponseDto(invitation);
    }

    async findAll(tenantId: string, query: InvitationQueryDto) {
        // Auto-expire past-due PENDING invitations
        await this.prisma.invitation.updateMany({
            where: {
                tenantId,
                status: 'PENDING',
                expiresAt: { lt: new Date() },
            },
            data: { status: 'EXPIRED' },
        });

        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = { tenantId };
        if (query.status) {
            where['status'] = query.status;
        }

        const [items, total] = await Promise.all([
            this.prisma.invitation.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    invitedBy: { select: { firstName: true, lastName: true } },
                },
            }),
            this.prisma.invitation.count({ where }),
        ]);

        return {
            data: items.map((i) => this.toResponseDto(i)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async revoke(id: string, tenantId: string, userId: string) {
        const invitation = await this.prisma.invitation.findFirst({
            where: { id, tenantId },
        });

        if (!invitation) {
            throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
        }

        if (invitation.status !== 'PENDING') {
            throw new HttpException(
                'Only pending invitations can be revoked',
                HttpStatus.BAD_REQUEST,
            );
        }

        await this.prisma.invitation.update({
            where: { id },
            data: { status: 'REVOKED' },
        });

        await this.prisma.auditLog.create({
            data: {
                tenantId,
                userId,
                action: 'invitation.revoked',
                entity: 'invitation',
                entityId: id,
            },
        });

        return { success: true };
    }

    async validate(token: string) {
        const invitation = await this.prisma.invitation.findFirst({
            where: { token },
            include: {
                tenant: { select: { name: true } },
            },
        }) as (InvitationRecord & { tenant: { name: string } }) | null;

        if (!invitation) {
            return { valid: false, reason: 'not_found' as const };
        }

        if (invitation.status === 'ACCEPTED') {
            return { valid: false, reason: 'already_used' as const };
        }

        if (invitation.status === 'REVOKED') {
            return { valid: false, reason: 'revoked' as const };
        }

        if (invitation.status === 'EXPIRED' || invitation.expiresAt < new Date()) {
            // Also update status if not already EXPIRED
            if (invitation.status !== 'EXPIRED') {
                await this.prisma.invitation.update({
                    where: { id: invitation.id },
                    data: { status: 'EXPIRED' },
                });
            }
            return { valid: false, reason: 'expired' as const };
        }

        return {
            valid: true,
            email: invitation.email,
            tenantName: invitation.tenant.name,
            role: invitation.role,
        };
    }

    async accept(dto: AcceptInvitationDto) {
        const invitation = await this.prisma.invitation.findFirst({
            where: { token: dto.token },
            include: {
                tenant: { select: { id: true, name: true } },
            },
        }) as (InvitationRecord & { tenant: { id: string; name: string } }) | null;

        if (!invitation) {
            throw new HttpException('Invalid invitation token', HttpStatus.BAD_REQUEST);
        }

        if (invitation.status !== 'PENDING') {
            const reason = invitation.status === 'ACCEPTED' ? 'already_used'
                : invitation.status === 'REVOKED' ? 'revoked' : 'expired';
            throw new HttpException(
                `Invitation is ${reason}`,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (invitation.expiresAt < new Date()) {
            await this.prisma.invitation.update({
                where: { id: invitation.id },
                data: { status: 'EXPIRED' },
            });
            throw new HttpException('Invitation has expired', HttpStatus.BAD_REQUEST);
        }

        const passwordHash = await bcrypt.hash(dto.password, PASSWORD_HASH_COST);

        const user = await this.prisma.user.create({
            data: {
                tenantId: invitation.tenantId,
                email: invitation.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: invitation.role as Parameters<typeof this.prisma.user.create>[0]['data']['role'],
                branchId: invitation.branchId,
            },
        });

        await this.prisma.invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED', acceptedAt: new Date() },
        });

        await this.prisma.auditLog.create({
            data: {
                tenantId: invitation.tenantId,
                userId: user.id,
                action: 'invitation.accepted',
                entity: 'invitation',
                entityId: invitation.id,
            },
        });

        await this.prisma.auditLog.create({
            data: {
                tenantId: invitation.tenantId,
                userId: user.id,
                action: 'user.created',
                entity: 'user',
                entityId: user.id,
                after: { email: user.email, role: user.role },
            },
        });

        const accessToken = await this.auth.issueAccessToken({
            id: user.id,
            tenantId: invitation.tenantId,
            role: user.role,
        });

        const refreshCreated = await this.auth.issueRefreshToken(user.id);

        return {
            accessToken,
            refreshRaw: refreshCreated.raw,
            user: {
                id: user.id,
                tenantId: user.tenantId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                branchId: user.branchId,
                avatarUrl: user.avatarUrl,
                isActive: user.isActive,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            },
        };
    }

    private toResponseDto(
        invitation: Record<string, unknown> & {
            invitedBy?: { firstName: string; lastName: string };
        },
    ) {
        return {
            id: invitation['id'] as string,
            email: invitation['email'] as string,
            role: invitation['role'] as string,
            status: invitation['status'] as string,
            branchId: (invitation['branchId'] as string | null) ?? null,
            invitedByName: invitation.invitedBy
                ? `${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`
                : '',
            expiresAt: invitation['expiresAt'] as Date,
            acceptedAt: (invitation['acceptedAt'] as Date | null) ?? null,
            createdAt: invitation['createdAt'] as Date,
        };
    }
}
