import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchResult {
  id: string;
  type: 'client' | 'policy' | 'claim' | 'lead' | 'quote';
  title: string;
  subtitle: string;
  href: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(
    tenantId: string,
    query: string,
    limit = 20,
  ): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // Search Clients
    const clients = await this.prisma.client.findMany({
      where: {
        tenantId,
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
          { ghanaCardNumber: { contains: searchTerm, mode: 'insensitive' } },
          { companyName: { contains: searchTerm, mode: 'insensitive' } },
          { clientNumber: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        type: true,
      },
    });

    results.push(
      ...clients.map((c) => ({
        id: c.id,
        type: 'client' as const,
        title: `${c.firstName} ${c.lastName}`,
        subtitle: c.email || c.type,
        href: `/dashboard/clients/${c.id}`,
      })),
    );

    // Search Policies
    const policies = await this.prisma.policy.findMany({
      where: {
        tenantId,
        OR: [
          { policyNumber: { contains: searchTerm, mode: 'insensitive' } },
          {
            client: {
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { companyName: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        policyNumber: true,
        insuranceType: true,
        status: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    results.push(
      ...policies.map((p) => ({
        id: p.id,
        type: 'policy' as const,
        title: p.policyNumber,
        subtitle: `${p.insuranceType} - ${p.client.firstName} ${p.client.lastName}`,
        href: `/dashboard/policies/${p.id}`,
        metadata: { status: p.status },
      })),
    );

    // Search Claims
    const claims = await this.prisma.claim.findMany({
      where: {
        tenantId,
        OR: [
          { claimNumber: { contains: searchTerm, mode: 'insensitive' } },
          {
            client: {
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { companyName: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
      take: 5,
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    results.push(
      ...claims.map((c) => ({
        id: c.id,
        type: 'claim' as const,
        title: c.claimNumber,
        subtitle: `${c.insuranceType} - ${c.client.firstName} ${c.client.lastName}`,
        href: `/dashboard/claims/${c.id}`,
        metadata: { status: c.status },
      })),
    );

    // Search Leads
    const leads = await this.prisma.lead.findMany({
      where: {
        tenantId,
        OR: [
          { contactName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
          { companyName: { contains: searchTerm, mode: 'insensitive' } },
          { leadNumber: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: {
        id: true,
        contactName: true,
        companyName: true,
        status: true,
      },
    });

    results.push(
      ...leads.map((l) => ({
        id: l.id,
        type: 'lead' as const,
        title: l.companyName || l.contactName,
        subtitle: `Lead - ${l.status}`,
        href: `/dashboard/leads/${l.id}`,
      })),
    );

    // Search Quotes
    const quotes = await this.prisma.quote.findMany({
      where: {
        tenantId,
        OR: [
          { quoteNumber: { contains: searchTerm, mode: 'insensitive' } },
          {
            client: {
              OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { companyName: { contains: searchTerm, mode: 'insensitive' } },
              ],
            },
          },
        ],
      },
      take: 5,
      select: {
        id: true,
        quoteNumber: true,
        insuranceType: true,
        status: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    results.push(
      ...quotes.map((q) => ({
        id: q.id,
        type: 'quote' as const,
        title: q.quoteNumber,
        subtitle: `${q.insuranceType} Quote - ${q.client.firstName} ${q.client.lastName}`,
        href: `/dashboard/quotes`,
        metadata: { status: q.status },
      })),
    );

    return results.slice(0, limit);
  }

  async getRecentItems(
    tenantId: string,
    userId: string,
    limit = 5,
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    const recentAudits = await this.prisma.auditLog.findMany({
      where: {
        tenantId,
        userId,
        entity: {
          in: ['Client', 'Policy', 'Claim', 'Lead'],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 2,
      distinct: ['entityId'],
      select: {
        entity: true,
        entityId: true,
      },
    });

    for (const audit of recentAudits) {
      if (results.length >= limit) break;

      try {
        if (audit.entity === 'Client') {
          const client = await this.prisma.client.findUnique({
            where: { id: audit.entityId },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              type: true,
            },
          });
          if (client) {
            results.push({
              id: client.id,
              type: 'client',
              title: `${client.firstName} ${client.lastName}`,
              subtitle: client.type,
              href: `/dashboard/clients/${client.id}`,
            });
          }
        } else if (audit.entity === 'Policy') {
          const policy = await this.prisma.policy.findUnique({
            where: { id: audit.entityId },
            select: {
              id: true,
              policyNumber: true,
              insuranceType: true,
              status: true,
            },
          });
          if (policy) {
            results.push({
              id: policy.id,
              type: 'policy',
              title: policy.policyNumber,
              subtitle: `${policy.insuranceType} Policy`,
              href: `/dashboard/policies/${policy.id}`,
            });
          }
        } else if (audit.entity === 'Claim') {
          const claim = await this.prisma.claim.findUnique({
            where: { id: audit.entityId },
            select: {
              id: true,
              claimNumber: true,
              status: true,
            },
          });
          if (claim) {
            results.push({
              id: claim.id,
              type: 'claim',
              title: claim.claimNumber,
              subtitle: `${claim.status} Claim`,
              href: `/dashboard/claims/${claim.id}`,
            });
          }
        } else if (audit.entity === 'Lead') {
          const lead = await this.prisma.lead.findUnique({
            where: { id: audit.entityId },
            select: {
              id: true,
              contactName: true,
              companyName: true,
            },
          });
          if (lead) {
            results.push({
              id: lead.id,
              type: 'lead',
              title: lead.companyName || lead.contactName,
              subtitle: 'Lead',
              href: `/dashboard/leads/${lead.id}`,
            });
          }
        }
      } catch {
        continue;
      }
    }

    return results;
  }
}
