CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_user_id VARCHAR(255) UNIQUE,
    organization_id UUID,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile VARCHAR(15),
    role VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert demo users
-- Password for all is 'password'
-- BCrypt hash of 'password' with strength 10: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq
INSERT INTO users (full_name, email, mobile, role, password_hash) VALUES 
('Rahul Sharma - Industry', 'industry@example.com', '9876543210', 'INDUSTRY',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq'),
('Dr. Priya Singh - Officer', 'officer@cdsco.gov.in', '9876543211', 'CDSCO_OFFICER', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq'),
('Suresh Kumar - Senior', 'senior@cdsco.gov.in', '9876543212', 'CDSCO_SENIOR', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq'),
('Anita Verma - Admin', 'admin@cdsco.gov.in', '9876543213', 'ADMIN',          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq');
