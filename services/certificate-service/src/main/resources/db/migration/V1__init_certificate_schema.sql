CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    application_id UUID,
    organization_id UUID NOT NULL,
    licence_type VARCHAR(50),
    certificate_type VARCHAR(100),
    issued_by_officer_id UUID,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    qr_code_data TEXT,
    digital_signature TEXT,
    pdf_minio_key TEXT,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revocation_reason TEXT,
    revoked_at TIMESTAMPTZ
);
