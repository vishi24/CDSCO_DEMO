CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_code VARCHAR(20) UNIQUE NOT NULL,
    org_name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL,   
    gst_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(10),
    cin_number VARCHAR(21),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state_code VARCHAR(5),
    district VARCHAR(100),
    pincode VARCHAR(10),
    contact_person_name VARCHAR(255),
    contact_person_designation VARCHAR(100),
    digital_signature_path TEXT,
    status VARCHAR(30) DEFAULT 'PENDING_APPROVAL', 
    keycloak_user_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id VARCHAR(50) DEFAULT 'cdsco'
);

CREATE TABLE organization_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    document_type VARCHAR(100),
    document_name VARCHAR(255),
    minio_bucket VARCHAR(100),
    minio_object_key TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by VARCHAR(255)
);

-- Seed an industry organization to match the identity-service seed
INSERT INTO organizations (org_code, org_name, org_type, email, mobile, status) VALUES 
('ORG-10001', 'Sun Pharmaceuticals Ltd', 'PHARMA', 'industry@example.com', '9876543210', 'APPROVED');
