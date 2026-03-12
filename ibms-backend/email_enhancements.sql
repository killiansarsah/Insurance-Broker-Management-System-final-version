-- Add email notification preferences to User model
-- Add email logs table for tracking sent emails
-- Add email templates table for template management
-- Add email queue table for retry logic

-- Email notification preferences (JSON field in User table)
ALTER TABLE users ADD COLUMN email_preferences JSON DEFAULT '{"policyRenewal": true, "claimUpdates": true, "taskAssignments": true, "systemNotifications": true, "marketingEmails": false}';

-- Email logs table
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_email VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    template_name VARCHAR NOT NULL,
    template_data JSON DEFAULT '{}',
    status VARCHAR NOT NULL DEFAULT 'pending', -- pending, sent, failed, bounced
    provider VARCHAR DEFAULT 'console', -- console, sendgrid, etc
    provider_message_id VARCHAR,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP DEFAULT NOW(),
    sent_at TIMESTAMP,
    failed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_logs_tenant_id ON email_logs(tenant_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_scheduled_at ON email_logs(scheduled_at);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);

-- Email templates table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL, -- policy_renewal, claim_update, etc
    display_name VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSON DEFAULT '[]', -- array of variable names
    is_active BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT false, -- system templates cannot be deleted
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_email_templates_tenant_name ON email_templates(tenant_id, name);
CREATE INDEX idx_email_templates_tenant_id ON email_templates(tenant_id);

-- Email queue table for retry logic
CREATE TABLE email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_email VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    template_name VARCHAR,
    template_data JSON DEFAULT '{}',
    priority INTEGER DEFAULT 5, -- 1=highest, 10=lowest
    status VARCHAR NOT NULL DEFAULT 'queued', -- queued, processing, sent, failed, cancelled
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled_at ON email_queue(scheduled_at);
CREATE INDEX idx_email_queue_priority ON email_queue(priority);
CREATE INDEX idx_email_queue_tenant_id ON email_queue(tenant_id);