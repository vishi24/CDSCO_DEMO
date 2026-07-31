#!/bin/bash
set -e

# Create schemas/databases for microservices
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE ddrs_identity;
    CREATE DATABASE ddrs_organization;
    CREATE DATABASE ddrs_licence;
    CREATE DATABASE ddrs_workflow;
    CREATE DATABASE ddrs_registry;
    CREATE DATABASE ddrs_certificate;
    CREATE DATABASE ddrs_notification;
    CREATE DATABASE ddrs_document;
    CREATE DATABASE ddrs_dashboard;
    CREATE DATABASE ddrs_master;
    CREATE DATABASE ddrs_admin;
    CREATE DATABASE ddrs_audit;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE ddrs_identity TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_organization TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_licence TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_workflow TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_registry TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_certificate TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_notification TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_document TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_dashboard TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_master TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_admin TO ddrs_user;
    GRANT ALL PRIVILEGES ON DATABASE ddrs_audit TO ddrs_user;
EOSQL
