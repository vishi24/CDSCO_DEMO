-- Connect to organization DB to insert Orgs
\c ddrs_organization

INSERT INTO organizations (id, org_code, org_name, org_type, email, mobile, status) VALUES
('11111111-1111-1111-1111-111111111111', 'ORG-SUN', 'Sun Pharmaceuticals Ltd', 'PHARMA', 'admin@sunpharma.com', '9999999991', 'APPROVED'),
('22222222-2222-2222-2222-222222222222', 'ORG-CIPLA', 'Cipla India Pvt Ltd', 'PHARMA', 'contact@cipla.com', '9999999992', 'APPROVED'),
('33333333-3333-3333-3333-333333333333', 'ORG-BHARAT', 'Bharat Biotech International', 'PHARMA', 'info@bharatbiotech.com', '9999999993', 'APPROVED'),
('44444444-4444-4444-4444-444444444444', 'ORG-SIEMENS', 'Siemens Healthineers India', 'DEVICE', 'regulatory@siemens.com', '9999999994', 'APPROVED'),
('55555555-5555-5555-5555-555555555555', 'ORG-HIMA', 'Himalaya Drug Company', 'COSMETIC', 'ayurveda@himalaya.com', '9999999995', 'APPROVED')
ON CONFLICT DO NOTHING;

-- Connect to identity DB to insert Users
\c ddrs_identity

-- Password for all is 'password' (BCrypt hash, strength 10)
INSERT INTO users (id, keycloak_user_id, organization_id, full_name, email, role, is_active, password_hash) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'keycloak-ind-1', '11111111-1111-1111-1111-111111111111', 'Sun Pharma Admin', 'admin@sunpharma.com', 'INDUSTRY', true, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'keycloak-off-1', NULL, 'Dr. CDSCO Officer', 'officer@cdsco.gov.in', 'CDSCO_OFFICER', true, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'keycloak-sen-1', NULL, 'Senior Reviewer', 'senior@cdsco.gov.in', 'CDSCO_SENIOR', true, '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq')
ON CONFLICT DO NOTHING;

-- Connect to registry DB to insert Drugs
\c ddrs_registry

INSERT INTO drug_products (id, registry_id, brand_name, generic_name, drug_category, manufacturer_id, status) VALUES
('d1111111-1111-1111-1111-111111111111', 'REG-D-001', 'Paracetamol 500mg', 'Paracetamol', 'ALLOPATHIC', '11111111-1111-1111-1111-111111111111', 'REGISTERED'),
('d2222222-2222-2222-2222-222222222222', 'REG-D-002', 'Covaxin', 'Whole Virion Inactivated Corona Virus Vaccine', 'VACCINE', '33333333-3333-3333-3333-333333333333', 'REGISTERED'),
('d3333333-3333-3333-3333-333333333333', 'REG-D-003', 'Azithromycin 250', 'Azithromycin', 'ALLOPATHIC', '22222222-2222-2222-2222-222222222222', 'REGISTERED')
ON CONFLICT DO NOTHING;

-- Insert Medical Devices
INSERT INTO medical_devices (id, registry_id, device_name, device_class, manufacturer_id, status) VALUES
('e1111111-1111-1111-1111-111111111111', 'REG-M-001', 'MRI Scanner Magnetom', 'CLASS_C', '44444444-4444-4444-4444-444444444444', 'REGISTERED')
ON CONFLICT DO NOTHING;

-- Connect to licence DB to insert Applications
\c ddrs_licence

INSERT INTO licence_applications (id, application_number, organization_id, licence_type, current_status) VALUES
('a1111111-1111-1111-1111-111111111111', 'APP-2026-0001', '11111111-1111-1111-1111-111111111111', 'MANUFACTURING', 'CERTIFICATE_ISSUED'),
('a2222222-2222-2222-2222-222222222222', 'APP-2026-0002', '22222222-2222-2222-2222-222222222222', 'DRUG_IMPORT', 'SCRUTINY'),
('a3333333-3333-3333-3333-333333333333', 'APP-2026-0003', '33333333-3333-3333-3333-333333333333', 'MANUFACTURING', 'QUERY_RAISED'),
('a4444444-4444-4444-4444-444444444444', 'APP-2026-0004', '44444444-4444-4444-4444-444444444444', 'MEDICAL_DEVICE', 'APPROVED')
ON CONFLICT DO NOTHING;

-- Connect to certificate DB to insert Certificates
\c ddrs_certificate

INSERT INTO certificates (id, certificate_number, application_id, organization_id, licence_type, issue_date, expiry_date, status) VALUES
('c1111111-1111-1111-1111-111111111111', 'CDSCO/2026/MFG/0001', 'a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'MANUFACTURING', '2026-01-01', '2031-01-01', 'ACTIVE')
ON CONFLICT DO NOTHING;
