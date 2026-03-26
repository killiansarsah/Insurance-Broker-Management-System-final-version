const fs = require('fs');
let code = fs.readFileSync('ibms-backend/src/renewals/renewals.service.ts', 'utf8');

// Find the broken bulkSendReminders start
const brokenStart = code.indexOf('async bulkSendReminders(tenantId: string, policyIds: string[], userId: string)');
// Find the getRenewalReport (which is intact)  
const goodStart = code.indexOf('async getRenewalReport(');

if (brokenStart === -1 || goodStart === -1) {
  console.log('MARKERS NOT FOUND. Lengths:', brokenStart, goodStart);
  process.exit(1);
}

const before = code.substring(0, brokenStart);
const after = code.substring(goodStart);

const restored = `async bulkSendReminders(tenantId, policyIds, userId) {
    const policies = await this.prisma.policy.findMany({
      where: { tenantId, id: { in: policyIds } },
      include: {
        client: { select: { email: true, firstName: true, lastName: true, companyName: true } },
        carrier: { select: { name: true } },
      },
    });

    const templates = await this.prisma.renewalTemplate.findMany({
      where: { tenantId, isActive: true },
      orderBy: { triggerDays: 'desc' },
    });

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, nicLicense: true, phone: true, email: true },
    });

    let sent = 0, skipped = 0, failed = 0;
    const now = new Date();

    for (const policy of policies) {
      if (!policy.client?.email) { skipped++; continue; }

      const daysUntilExpiry = Math.ceil((policy.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const tpl = templates.find((t) => t.triggerDays >= daysUntilExpiry) ?? templates[templates.length - 1];

      try {
        if (tpl) {
          const vars = {
            client_first_name: policy.client.firstName || policy.client.companyName || 'Valued Client',
            policy_number: policy.policyNumber,
            insurance_type: policy.insuranceType,
            expiry_date: policy.expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            days_remaining: String(Math.max(0, daysUntilExpiry)),
            current_premium: 'GHS ' + Number(policy.premiumAmount).toLocaleString(),
            carrier_name: policy.carrier ? policy.carrier.name : '',
            vehicle_reg: '',
            property_address: '',
            officer_name: '',
            officer_phone: '',
            agency_name: tenant ? tenant.name : '',
            agency_nic_number: tenant ? tenant.nicLicense : '',
            agency_phone: tenant ? tenant.phone : '',
            agency_email: tenant ? tenant.email : '',
          };
          await this.emailService.sendFromRenewalTemplate(policy.client.email, tpl.subject, tpl.htmlContent, vars);
        } else {
          const clientName = policy.client.companyName || policy.client.firstName + ' ' + policy.client.lastName;
          await this.emailService.sendPolicyRenewalReminder(
            policy.client.email,
            clientName,
            policy.policyNumber,
            policy.expiryDate,
            daysUntilExpiry,
            Number(policy.premiumAmount),
            policy.insuranceType,
          );
        }
        sent++;
        await this.prisma.renewalLog.create({
          data: {
            tenantId,
            policyId: policy.id,
            createdBy: userId,
            logType: 'EMAIL_SENT',
            title: 'Bulk Reminder Sent',
            details: 'Manual bulk reminder dispatched to ' + policy.client.email,
          },
        });
      } catch (error) {
        this.logger.error('Failed bulk reminder for ' + policy.policyNumber, error);
        failed++;
      }
    }

    return { sent, skipped, failed };
  }

  async bulkAssignBroker(tenantId, policyIds, brokerId, userId) {
    await this.prisma.policy.updateMany({
      where: { tenantId, id: { in: policyIds } },
      data: { brokerId },
    });
    const logs = policyIds.map((id) => ({
      tenantId, policyId: id, createdBy: userId,
      logType: 'STATUS_CHANGE',
      title: 'Broker Reassigned',
      details: 'Assigned via bulk action',
    }));
    if (logs.length > 0) await this.prisma.renewalLog.createMany({ data: logs });
    return { success: true, count: policyIds.length };
  }

  async bulkUpdateStatus(tenantId, policyIds, status, userId) {
    await this.prisma.policy.updateMany({
      where: { tenantId, id: { in: policyIds } },
      data: { renewalStatus: status },
    });
    const logs = policyIds.map((id) => ({
      tenantId, policyId: id, createdBy: userId,
      logType: 'STATUS_CHANGE',
      title: 'Status Updated',
      details: 'Bulk status update to ' + status,
    }));
    if (logs.length > 0) await this.prisma.renewalLog.createMany({ data: logs });
    return { success: true, count: policyIds.length };
  }

  async getTemplates(tenantId) {
    return this.prisma.renewalTemplate.findMany({
      where: { tenantId },
      orderBy: { triggerDays: 'desc' },
    });
  }

  async updateTemplate(tenantId, id, data) {
    return this.prisma.renewalTemplate.update({
      where: { id, tenantId },
      data,
    });
  }

  `;

code = before + restored + after;
fs.writeFileSync('ibms-backend/src/renewals/renewals.service.ts', code);
console.log('Restored! Lines:', code.split('\n').length);
