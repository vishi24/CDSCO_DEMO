ALTER TABLE organizations ADD COLUMN IF NOT EXISTS aadhaar_token VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS cin_llpin VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_person_name VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS contact_person_designation VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS alternate_mobile VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS alternate_email VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS user_type VARCHAR(255);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS ddrs_user_id VARCHAR(255);
