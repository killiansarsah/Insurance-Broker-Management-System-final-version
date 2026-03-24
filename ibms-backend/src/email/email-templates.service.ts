import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    // Return empty templates for now
    return {
      templates: [],
      meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    };
  }

  async findOne(tenantId: string, id: string) {
    throw new NotFoundException('Template not found');
  }

  async create(tenantId: string, userId: string, dto: any) {
    throw new Error('Template creation not available yet');
  }

  async update(tenantId: string, id: string, dto: any) {
    throw new Error('Template update not available yet');
  }

  async delete(tenantId: string, id: string) {
    throw new Error('Template deletion not available yet');
  }

  compileTemplate(htmlContent: string, data: Record<string, any>): string {
    let compiled = htmlContent;

    // Replace variables in format {{variableName}}
    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      compiled = compiled.replace(regex, String(data[key] || ''));
    });

    // Remove any remaining unreplaced variables
    compiled = compiled.replace(/{{[^}]+}}/g, '');

    return compiled;
  }

  // User preferences management (simplified)
  async getUserPreferences(userId: string) {
    return {
      policyRenewal: true,
      claimUpdates: true,
      taskAssignments: true,
      systemNotifications: true,
      marketingEmails: false,
    };
  }

  async updateUserPreferences(userId: string, dto: any) {
    // For now, just return the updated preferences
    return {
      policyRenewal: true,
      claimUpdates: true,
      taskAssignments: true,
      systemNotifications: true,
      marketingEmails: false,
      ...dto,
    };
  }
}
