CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    action VARCHAR(100) NOT NULL,
    performed_by UUID,
    user_role VARCHAR(50),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    details TEXT,
    ip_address VARCHAR(45)
);

-- Seed some mock audit logs
INSERT INTO audit_logs (entity_type, entity_id, action, user_role, details, performed_at) VALUES
('SYSTEM', NULL, 'SYSTEM_STARTUP', 'SYSTEM', 'Audit Service initialized', NOW() - INTERVAL '2 days'),
('ORGANIZATION', gen_random_uuid(), 'ORG_REGISTERED', 'INDUSTRY', 'New organization registered: Sun Pharmaceuticals', NOW() - INTERVAL '1 day'),
('ORGANIZATION', gen_random_uuid(), 'ORG_APPROVED', 'CDSCO_OFFICER', 'Organization approved', NOW() - INTERVAL '20 hours'),
('APPLICATION', gen_random_uuid(), 'APP_SUBMITTED', 'INDUSTRY', 'Licence application submitted', NOW() - INTERVAL '15 hours'),
('APPLICATION', gen_random_uuid(), 'APP_APPROVED', 'CDSCO_SENIOR', 'Licence application approved', NOW() - INTERVAL '2 hours'),
('MASTER_DATA', NULL, 'CONFIG_UPDATED', 'ADMIN', 'Updated Master Data configuration for DEVICE_CLASS', NOW() - INTERVAL '1 hour');
