CREATE TABLE drug_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    drug_category VARCHAR(100),
    dosage_form VARCHAR(100),
    route_of_administration VARCHAR(100),
    strength VARCHAR(100),
    manufacturer_id UUID,
    schedule_category VARCHAR(50),
    approved_indications TEXT,
    contraindications TEXT,
    status VARCHAR(30) DEFAULT 'REGISTERED',
    registration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE medical_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    device_name VARCHAR(255) NOT NULL,
    device_class VARCHAR(10),
    is_ivd BOOLEAN DEFAULT FALSE,
    manufacturer_id UUID,
    intended_use TEXT,
    risk_level VARCHAR(50),
    gmddn_code VARCHAR(30),
    status VARCHAR(30) DEFAULT 'REGISTERED',
    registration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
