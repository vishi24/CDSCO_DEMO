CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100),
    entity_id UUID NOT NULL,
    workflow_definition_id VARCHAR(100),
    current_stage VARCHAR(50),
    previous_stage VARCHAR(50),
    assigned_to UUID,
    sla_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID REFERENCES workflow_instances(id),
    from_stage VARCHAR(50),
    to_stage VARCHAR(50),
    action VARCHAR(50),
    action_by UUID,
    action_at TIMESTAMPTZ DEFAULT NOW(),
    comments TEXT,
    attachments_json TEXT
);

CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID,
    query_number VARCHAR(30) UNIQUE,
    raised_by UUID,
    raised_at TIMESTAMPTZ DEFAULT NOW(),
    query_text TEXT NOT NULL,
    response_text TEXT,
    responded_by UUID,
    responded_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'OPEN',
    attachments_json TEXT
);
