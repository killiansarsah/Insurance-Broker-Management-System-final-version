import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async kycQueue(tenantId: string) {
    const clients = await this.prisma.client.findMany({
      where: {
        tenantId,
        deletedAt: null,
        kycStatus: { in: ['PENDING', 'EXPIRED'] },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        clientNumber: true,
        ghanaCardNumber: true,
        kycStatus: true,
        createdAt: true,
      },
    });

    return clients.map((c) => ({
      ...c,
      clientName: `${c.firstName} ${c.lastName}`,
      daysPending: Math.floor(
        (Date.now() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      ),
    }));
  }

  async amlScreening(tenantId: string) {
    const clients = await this.prisma.client.findMany({
      where: {
        tenantId,
        deletedAt: null,
        amlRiskLevel: { in: ['HIGH', 'CRITICAL'] },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        clientNumber: true,
        amlRiskLevel: true,
        createdAt: true,
        _count: {
          select: {
            policies: { where: { status: 'ACTIVE', deletedAt: null } },
          },
        },
      },
    });

    return clients.map((c) => ({
      id: c.id,
      clientName: `${c.firstName} ${c.lastName}`,
      clientNumber: c.clientNumber,
      amlRiskLevel: c.amlRiskLevel,
      activePolicies: c._count.policies,
      createdAt: c.createdAt,
    }));
  }

  async nicDeadlines(tenantId: string) {
    const now = new Date();

    const claims = await this.prisma.claim.findMany({
      where: {
        tenantId,
        deletedAt: null,
        status: {
          in: ['INTIMATED', 'REGISTERED', 'DOCUMENTS_PENDING', 'UNDER_REVIEW'],
        },
        OR: [
          {
            acknowledgmentDeadline: {
              lte: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
          },
          {
            processingDeadline: {
              lte: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        claimNumber: true,
        status: true,
        acknowledgmentDeadline: true,
        processingDeadline: true,
        createdAt: true,
        client: { select: { firstName: true, lastName: true } },
      },
    });

    return claims.map((c) => {
      const ackDeadline = c.acknowledgmentDeadline;
      const processDeadline = c.processingDeadline;
      const ackOverdue = ackDeadline < now && c.status === 'INTIMATED';
      const processOverdue = processDeadline < now;

      return {
        id: c.id,
        claimNumber: c.claimNumber,
        clientName: c.client
          ? `${c.client.firstName} ${c.client.lastName}`
          : 'Unknown',
        status: c.status,
        deadline5Day: {
          date: ackDeadline,
          isOverdue: ackOverdue,
        },
        deadline30Day: {
          date: processDeadline,
          isOverdue: processOverdue,
        },
        daysOverdue: processOverdue
          ? Math.floor(
              (now.getTime() - processDeadline.getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : 0,
      };
    });
  }

  async summary(tenantId: string) {
    const now = new Date();

    const [
      kycPending,
      kycVerified,
      kycRejected,
      kycExpired,
      amlLow,
      amlMedium,
      amlHigh,
      amlCritical,
      nicOnTrack,
      nicAtRisk,
      nicOverdue,
      slaWithin,
      slaBreached,
    ] = await Promise.all([
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, kycStatus: 'PENDING' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, kycStatus: 'VERIFIED' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, kycStatus: 'REJECTED' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, kycStatus: 'EXPIRED' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, amlRiskLevel: 'LOW' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, amlRiskLevel: 'MEDIUM' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, amlRiskLevel: 'HIGH' },
      }),
      this.prisma.client.count({
        where: { tenantId, deletedAt: null, amlRiskLevel: 'CRITICAL' },
      }),
      this.prisma.claim.count({
        where: {
          tenantId,
          deletedAt: null,
          status: {
            in: [
              'INTIMATED',
              'REGISTERED',
              'DOCUMENTS_PENDING',
              'UNDER_REVIEW',
            ],
          },
          processingDeadline: {
            gt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.claim.count({
        where: {
          tenantId,
          deletedAt: null,
          status: {
            in: [
              'INTIMATED',
              'REGISTERED',
              'DOCUMENTS_PENDING',
              'UNDER_REVIEW',
            ],
          },
          processingDeadline: {
            gt: now,
            lte: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.claim.count({
        where: {
          tenantId,
          deletedAt: null,
          status: {
            in: [
              'INTIMATED',
              'REGISTERED',
              'DOCUMENTS_PENDING',
              'UNDER_REVIEW',
            ],
          },
          processingDeadline: { lt: now },
        },
      }),
      this.prisma.complaint.count({
        where: {
          tenantId,
          isBreached: false,
          status: { notIn: ['RESOLVED', 'CLOSED'] },
        },
      }),
      this.prisma.complaint.count({
        where: {
          tenantId,
          isBreached: true,
          status: { notIn: ['RESOLVED', 'CLOSED'] },
        },
      }),
    ]);

    return {
      kyc: {
        pending: kycPending,
        verified: kycVerified,
        rejected: kycRejected,
        expired: kycExpired,
      },
      aml: {
        low: amlLow,
        medium: amlMedium,
        high: amlHigh,
        critical: amlCritical,
      },
      nic: { onTrack: nicOnTrack, atRisk: nicAtRisk, overdue: nicOverdue },
      complaintSla: { withinSla: slaWithin, breached: slaBreached },
    };
  }
}
