CREATE TABLE master_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category, code)
);

-- Seed basic master data
INSERT INTO master_data (category, code, name, description) VALUES 
('DRUG_TYPE', 'VACCINE', 'Vaccines & Recombinant', 'Vaccines, sera, and recombinant DNA drugs'),
('DRUG_TYPE', 'MEDICAL_DEVICE', 'Medical Devices', 'Notified medical devices and IVDs'),
('DRUG_TYPE', 'BLOOD_BANK', 'Blood Products', 'Blood banks and blood components'),
('DRUG_TYPE', 'COSMETICS', 'Cosmetics', 'Cosmetics and personal care items'),
('DEVICE_CLASS', 'CLASS_A', 'Class A', 'Low risk medical devices'),
('DEVICE_CLASS', 'CLASS_B', 'Class B', 'Low-moderate risk medical devices'),
('DEVICE_CLASS', 'CLASS_C', 'Class C', 'Moderate-high risk medical devices'),
('DEVICE_CLASS', 'CLASS_D', 'Class D', 'High risk medical devices');
