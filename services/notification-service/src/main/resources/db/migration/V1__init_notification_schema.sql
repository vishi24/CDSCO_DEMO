CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Seed some mock notifications for the admin user (we will assume the admin user ID will be fetched dynamically, or we use a known ID if we hardcode. Let's just insert some generic ones and the frontend can fetch all for demo if needed, but normally it filters by userId. To make demo work without knowing UUID, we'll insert them for the admin email later via a script or just leave it empty and let actions trigger them).
-- Actually let's create a known UUID for demo admin: '00000000-0000-0000-0000-000000000001'
INSERT INTO notifications (recipient_user_id, title, body, type, is_read, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'System Update', 'DDRS v2.0 successfully deployed.', 'INFO', FALSE, NOW() - INTERVAL '1 hour'),
('00000000-0000-0000-0000-000000000001', 'Security Alert', 'New login from unknown IP address.', 'WARNING', FALSE, NOW() - INTERVAL '3 hours'),
('00000000-0000-0000-0000-000000000001', 'Application Approved', 'Licence APP-2026-001 has been approved.', 'SUCCESS', TRUE, NOW() - INTERVAL '1 day');
