CREATE TABLE licence_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(30) UNIQUE NOT NULL,
    organization_id UUID NOT NULL,
    licence_type VARCHAR(50) NOT NULL,
    sub_category VARCHAR(100),
    application_date TIMESTAMPTZ DEFAULT NOW(),
    current_status VARCHAR(50) DEFAULT 'DRAFT',
    assigned_officer_id UUID,
    fee_amount DECIMAL(12,2),
    fee_paid BOOLEAN DEFAULT FALSE,
    fee_receipt_number VARCHAR(50),
    remarks TEXT,
    rejection_reason TEXT,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    expiry_date DATE
);

CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES licence_applications(id),
    document_type VARCHAR(100),
    document_name VARCHAR(255),
    minio_key TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID
);
