# Digital Drugs Regulatory System (DDRS) — CDSCO Demo
## Comprehensive Technical Implementation Plan

> **Project Type**: Production-quality Demo Application for CDSCO Presentation  
> **Audience**: Senior Government Officials, CDSCO Leadership  
> **Objective**: Showcase the future vision of a unified Digital Drugs Regulatory System

---

## 1. Executive Summary

This plan delivers a **polished, enterprise-grade demo** of the DDRS portal. The application demonstrates end-to-end regulatory workflows — from company registration through licensing, query management, and digitally signed certificate issuance — across Industry, CDSCO Officer, and Administrator roles. All external infrastructure (Kafka, Keycloak, OpenSearch, MinIO, Sunbird RC) is either embedded or mocked so the demo runs entirely self-contained with no external dependencies.

---

## 2. High-Level Solution Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│          React 18 + TypeScript + Material UI v5 SPA             │
│    (Industry Portal | CDSCO Portal | Admin Portal)              │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / REST / WebSocket
┌────────────────────────▼────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
│             OpenHIM (mocked in demo via Nginx)                  │
│           Rate Limiting | Auth | Routing | Logging              │
└──────┬─────────────┬─────────────┬──────────────┬──────────────┘
       │             │             │              │
┌──────▼──┐  ┌───────▼──┐  ┌──────▼───┐  ┌──────▼──────────────┐
│Identity │  │ Org /    │  │ Licence  │  │ Workflow Service     │
│Service  │  │ Registry │  │ Service  │  │ (DIGIT-like engine)  │
│(Auth)   │  │ Service  │  │          │  │                      │
└──────┬──┘  └───────┬──┘  └──────┬───┘  └──────┬──────────────┘
       │             │             │              │
┌──────▼─────────────▼─────────────▼──────────────▼──────────────┐
│                   MESSAGE BUS (Kafka / Mock)                     │
└──────┬─────────────┬─────────────┬──────────────┬──────────────┘
       │             │             │              │
┌──────▼──┐  ┌───────▼──┐  ┌──────▼───┐  ┌──────▼──────────────┐
│Cert     │  │Document  │  │Notif.    │  │Dashboard / Search   │
│Service  │  │Service   │  │Service   │  │Service              │
└──────┬──┘  └───────┬──┘  └──────┬───┘  └──────┬──────────────┘
       │             │             │              │
┌──────▼─────────────▼─────────────▼──────────────▼──────────────┐
│              PERSISTENCE & STORAGE LAYER                        │
│    PostgreSQL 16 | MinIO (file storage) | Redis (cache)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack (Final Choices)

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.x | Core UI framework |
| TypeScript | 5.x | Type safety |
| Material UI | 5.x | Design system |
| React Router | 6.x | Client-side routing |
| Redux Toolkit | 2.x | State management |
| React Query (TanStack) | 5.x | Server state & caching |
| Chart.js + react-chartjs-2 | Latest | Analytics charts |
| Recharts | Latest | Dashboard maps/heatmaps |
| Formik + Yup | Latest | Form management |
| Framer Motion | Latest | Animations |
| React PDF | Latest | PDF preview/download |
| QRCode.react | Latest | QR code generation |
| React Leaflet | Latest | State-wise maps |
| Dayjs | Latest | Date handling |
| Axios | Latest | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 (LTS) | Runtime |
| Spring Boot | 3.3.x | Application framework |
| Spring Security | 6.x | Security framework |
| Spring Data JPA | 3.x | ORM layer |
| Hibernate | 6.x | JPA implementation |
| Spring Cloud Gateway | 4.x | Internal API Gateway |
| MapStruct | 1.5.x | DTO mapping |
| Lombok | Latest | Boilerplate reduction |
| Spring Kafka | 3.x | Messaging (mock-able) |
| Flyway | Latest | DB migrations |
| OpenAPI 3 + SpringDoc | Latest | API documentation |
| Jasper Reports | Latest | Certificate PDF generation |
| iText / OpenPDF | Latest | Digital certificate PDF |
| ZXing | Latest | QR code generation |
| Testcontainers | Latest | Integration testing |
| MapBox / QR Embed | - | Geo-tagging |

### Infrastructure (Demo Mode — all containerized)
| Technology | Role |
|---|---|
| PostgreSQL 16 | Primary database |
| Keycloak 24 | Identity & auth (embedded in demo) |
| Apache Kafka 3.x | Messaging (KRaft mode, no Zookeeper) |
| MinIO | Object storage for documents |
| OpenSearch 2.x | Full-text search |
| Redis 7 | Caching & session |
| Nginx | Reverse proxy / API gateway mock |
| Docker + Docker Compose | Local demo orchestration |
| Kubernetes + Helm | Production-ready deployment manifests |

---

## 4. Microservices Architecture

### Service Map

```
ddrs-platform/
├── services/
│   ├── identity-service/          # Keycloak integration, auth, JWT, RBAC
│   ├── organization-service/      # Org registration, profile management
│   ├── licence-service/           # Licence application CRUD, status
│   ├── workflow-service/          # DIGIT-like engine, state machine
│   ├── registry-service/          # Drug/Device/Blood/Cosmetic registries
│   ├── certificate-service/       # PDF cert generation, QR, signing
│   ├── notification-service/      # Email, SMS, in-app (mock)
│   ├── document-service/          # MinIO upload, download, validation
│   ├── dashboard-service/         # Aggregated analytics APIs
│   ├── master-data-service/       # Reference data (drug categories, etc.)
│   ├── audit-service/             # Immutable audit trail
│   └── search-service/            # OpenSearch wrapper
├── gateway/                       # Spring Cloud Gateway / Nginx config
├── frontend/                      # React application
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── helm/
├── data-loader/                   # Demo seed data scripts
└── docs/                          # OpenAPI specs, architecture diagrams
```

### Service Responsibilities

| Service | Port | Key Responsibilities |
|---|---|---|
| identity-service | 8081 | Login, token issuance, role mgmt, OIDC via Keycloak |
| organization-service | 8082 | Org registration, KYC, profile, officer approval |
| licence-service | 8083 | Licence application, document linking, status |
| workflow-service | 8084 | Stage transitions, business rules, timeline |
| registry-service | 8085 | Drug/Device/Blood/Cosmetics/Manufacturer registries |
| certificate-service | 8086 | PDF generation, QR embedding, digital signature |
| notification-service | 8087 | Push, email, SMS notifications (mocked) |
| document-service | 8088 | MinIO integration, virus scan stub, metadata |
| dashboard-service | 8089 | KPIs, charts data, analytics aggregation |
| master-data-service | 8090 | Drug categories, ICD codes, dosage forms, GS1 |
| audit-service | 8091 | Write-once audit events, compliance logs |
| search-service | 8092 | OpenSearch integration, faceted search |
| api-gateway | 8080 | Entry point, auth filter, routing, rate limiting |

---

## 5. Domain Model & Database Schema

### 5.1 Core Entity Groups

#### Group A: Identity & Organization
```sql
-- organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_code VARCHAR(20) UNIQUE NOT NULL,
    org_name VARCHAR(255) NOT NULL,
    org_type VARCHAR(50) NOT NULL,   -- PHARMA | DEVICE | COSMETIC | BLOOD_BANK | CRO | LAB | IMPORTER
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
    status VARCHAR(30) DEFAULT 'PENDING_APPROVAL',  -- PENDING | APPROVED | REJECTED | SUSPENDED
    keycloak_user_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(255),
    tenant_id VARCHAR(50) DEFAULT 'cdsco'
);

-- organization_documents
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

-- users (keycloak-linked)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keycloak_user_id VARCHAR(255) UNIQUE,
    organization_id UUID REFERENCES organizations(id),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    mobile VARCHAR(15),
    role VARCHAR(50),  -- INDUSTRY | CDSCO_OFFICER | CDSCO_SENIOR | ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Group B: Licence Applications
```sql
-- licence_applications
CREATE TABLE licence_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(30) UNIQUE NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    licence_type VARCHAR(50) NOT NULL,
    -- DRUG_IMPORT | COSMETIC | MANUFACTURING | MEDICAL_DEVICE | BLOOD_PRODUCT
    sub_category VARCHAR(100),
    application_date TIMESTAMPTZ DEFAULT NOW(),
    current_status VARCHAR(50) DEFAULT 'DRAFT',
    -- DRAFT | SUBMITTED | SCRUTINY | QUERY_RAISED | RESPONSE_SUBMITTED
    -- TECHNICAL_REVIEW | APPROVED | CERTIFICATE_ISSUED | REJECTED | CLOSED
    assigned_officer_id UUID REFERENCES users(id),
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

-- application_documents
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES licence_applications(id),
    document_type VARCHAR(100),
    document_name VARCHAR(255),
    minio_key TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id)
);
```

#### Group C: Workflow Engine
```sql
-- workflow_instances
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100),     -- ORGANISATION | APPLICATION | REGISTRY
    entity_id UUID NOT NULL,
    workflow_definition_id VARCHAR(100),
    current_stage VARCHAR(50),
    previous_stage VARCHAR(50),
    assigned_to UUID REFERENCES users(id),
    sla_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- workflow_history
CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_instance_id UUID REFERENCES workflow_instances(id),
    from_stage VARCHAR(50),
    to_stage VARCHAR(50),
    action VARCHAR(50),           -- SUBMIT | APPROVE | REJECT | RAISE_QUERY | RESPOND | ISSUE_CERT
    action_by UUID REFERENCES users(id),
    action_at TIMESTAMPTZ DEFAULT NOW(),
    comments TEXT,
    attachments JSONB
);

-- queries
CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES licence_applications(id),
    query_number VARCHAR(30) UNIQUE,
    raised_by UUID REFERENCES users(id),
    raised_at TIMESTAMPTZ DEFAULT NOW(),
    query_text TEXT NOT NULL,
    response_text TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'OPEN',  -- OPEN | RESPONDED | CLOSED
    attachments JSONB
);
```

#### Group D: Certificates
```sql
-- certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    application_id UUID REFERENCES licence_applications(id),
    organization_id UUID REFERENCES organizations(id),
    licence_type VARCHAR(50),
    certificate_type VARCHAR(100),
    issued_by_officer_id UUID REFERENCES users(id),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    qr_code_data TEXT,
    digital_signature TEXT,
    pdf_minio_key TEXT,
    status VARCHAR(30) DEFAULT 'ACTIVE',  -- ACTIVE | EXPIRED | REVOKED | SUSPENDED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revocation_reason TEXT,
    revoked_at TIMESTAMPTZ
);
```

#### Group E: Registries
```sql
-- drug_products
CREATE TABLE drug_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    drug_category VARCHAR(100),   -- ALLOPATHIC | AYURVEDIC | FDC | VACCINE | BIOLOGICAL | VETERINARY
    dosage_form VARCHAR(100),
    route_of_administration VARCHAR(100),
    strength VARCHAR(100),
    manufacturer_id UUID REFERENCES organizations(id),
    schedule_category VARCHAR(50),  -- H | H1 | G | X | OTC
    icd_codes TEXT[],
    atc_code VARCHAR(20),
    approved_indications TEXT,
    contraindications TEXT,
    status VARCHAR(30) DEFAULT 'REGISTERED',
    registration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- medical_devices
CREATE TABLE medical_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    device_name VARCHAR(255) NOT NULL,
    device_class VARCHAR(10),      -- CLASS_A | CLASS_B | CLASS_C | CLASS_D
    is_ivd BOOLEAN DEFAULT FALSE,
    manufacturer_id UUID REFERENCES organizations(id),
    intended_use TEXT,
    risk_level VARCHAR(50),
    gmddn_code VARCHAR(30),
    status VARCHAR(30) DEFAULT 'REGISTERED',
    registration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- blood_banks
CREATE TABLE blood_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    bank_name VARCHAR(255),
    organization_id UUID REFERENCES organizations(id),
    bank_type VARCHAR(50),         -- HOSPITAL | STANDALONE | MOBILE
    storage_capacity INTEGER,
    blood_components TEXT[],
    geo_lat DECIMAL(10,8),
    geo_lng DECIMAL(11,8),
    status VARCHAR(30) DEFAULT 'REGISTERED',
    registration_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- cosmetic_products
CREATE TABLE cosmetic_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    manufacturer_id UUID REFERENCES organizations(id),
    category VARCHAR(100),
    ingredients JSONB,
    batch_number VARCHAR(50),
    manufacture_date DATE,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'REGISTERED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- testing_laboratories
CREATE TABLE testing_laboratories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    lab_name VARCHAR(255) NOT NULL,
    lab_type VARCHAR(50),          -- CDTL | RDTL | STATE | PRIVATE
    organization_id UUID REFERENCES organizations(id),
    nabl_accredited BOOLEAN DEFAULT FALSE,
    nabl_number VARCHAR(50),
    testing_capabilities TEXT[],
    geo_lat DECIMAL(10,8),
    geo_lng DECIMAL(11,8),
    state_code VARCHAR(5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- subject_matter_experts
CREATE TABLE subject_matter_experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registry_id VARCHAR(30) UNIQUE,
    expert_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    specialization VARCHAR(255),
    committee_membership TEXT[],   -- SEC | DTAB | CDAC
    qualification TEXT,
    experience_years INTEGER,
    affiliation VARCHAR(255),
    email VARCHAR(255),
    mobile VARCHAR(15),
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Group F: Master Data & Audit
```sql
-- master_drug_categories
CREATE TABLE master_drug_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    parent_code VARCHAR(20),
    level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- master_dosage_forms
CREATE TABLE master_dosage_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    edqm_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

-- audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100),
    entity_id UUID,
    action VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    performed_by UUID,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    tenant_id VARCHAR(50)
);

-- notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID REFERENCES users(id),
    title VARCHAR(255),
    body TEXT,
    type VARCHAR(50),   -- INFO | WARNING | SUCCESS | ERROR
    channel VARCHAR(30),  -- IN_APP | EMAIL | SMS
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    reference_entity_type VARCHAR(100),
    reference_entity_id UUID
);
```

---

## 6. API Specification Summary (OpenAPI 3.0)

### 6.1 Identity Service APIs
| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Keycloak token exchange |
| POST | `/auth/refresh` | Token refresh |
| POST | `/auth/logout` | Session invalidation |
| GET | `/auth/me` | Current user profile |
| GET | `/auth/roles` | User roles |

### 6.2 Organization Service APIs
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/organizations/register` | New org registration |
| GET | `/api/v1/organizations/{id}` | Org details |
| PUT | `/api/v1/organizations/{id}` | Update profile |
| POST | `/api/v1/organizations/{id}/approve` | Officer approves org |
| POST | `/api/v1/organizations/{id}/reject` | Officer rejects org |
| GET | `/api/v1/organizations` | List all (admin/officer) |
| POST | `/api/v1/organizations/{id}/documents` | Upload KYC documents |

### 6.3 Licence Service APIs
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/applications` | Create application |
| GET | `/api/v1/applications/{id}` | Application detail |
| GET | `/api/v1/applications` | List applications (with filters) |
| PUT | `/api/v1/applications/{id}` | Update draft |
| POST | `/api/v1/applications/{id}/submit` | Submit for review |
| POST | `/api/v1/applications/{id}/documents` | Upload documents |
| GET | `/api/v1/applications/{id}/timeline` | Workflow timeline |

### 6.4 Workflow Service APIs
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/workflow/approve` | Approve application |
| POST | `/api/v1/workflow/reject` | Reject application |
| POST | `/api/v1/workflow/raise-query` | Raise query |
| POST | `/api/v1/workflow/respond` | Respond to query |
| GET | `/api/v1/workflow/{entityId}/stages` | Get stage history |
| GET | `/api/v1/workflow/pending` | Officer's work queue |

### 6.5 Registry Service APIs
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/registry/drugs` | Register drug product |
| GET | `/api/v1/registry/drugs` | Search drug registry |
| POST | `/api/v1/registry/devices` | Register medical device |
| GET | `/api/v1/registry/devices` | Search device registry |
| POST | `/api/v1/registry/blood-banks` | Register blood bank |
| POST | `/api/v1/registry/cosmetics` | Register cosmetic |
| POST | `/api/v1/registry/labs` | Register laboratory |
| POST | `/api/v1/registry/experts` | Register SME |
| GET | `/api/v1/registry/search` | Cross-registry search |

### 6.6 Certificate Service APIs
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/certificates/generate` | Generate certificate |
| GET | `/api/v1/certificates/{id}` | Get certificate |
| GET | `/api/v1/certificates/{id}/download` | Download PDF |
| GET | `/api/v1/certificates/verify/{qrCode}` | QR verification |
| GET | `/api/v1/certificates` | List org certificates |

### 6.7 Dashboard Service APIs
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/dashboard/industry` | Industry dashboard stats |
| GET | `/api/v1/dashboard/officer` | CDSCO officer dashboard |
| GET | `/api/v1/dashboard/admin` | Admin dashboard |
| GET | `/api/v1/dashboard/state-distribution` | State-wise analytics |
| GET | `/api/v1/dashboard/registry-stats` | Registry growth stats |

---

## 7. Frontend Application Structure

```
frontend/
├── public/
│   ├── assets/
│   │   ├── logos/         # CDSCO, GoI emblems
│   │   ├── fonts/
│   │   └── icons/
│   └── index.html
├── src/
│   ├── app/
│   │   ├── store.ts                # Redux store
│   │   ├── App.tsx
│   │   └── routes.tsx              # React Router 6 config
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader/
│   │   │   ├── AppSidebar/
│   │   │   ├── Breadcrumb/
│   │   │   ├── StatusChip/
│   │   │   ├── WorkflowTimeline/
│   │   │   ├── DocumentUploader/
│   │   │   ├── CertificateViewer/
│   │   │   ├── NotificationPanel/
│   │   │   ├── ConfirmationDialog/
│   │   │   ├── DataTable/
│   │   │   ├── SearchBar/
│   │   │   └── LoadingOverlay/
│   │   ├── charts/
│   │   │   ├── BarChart/
│   │   │   ├── LineChart/
│   │   │   ├── PieChart/
│   │   │   ├── HeatmapChart/
│   │   │   ├── StatCard/
│   │   │   └── IndiaMapChart/
│   │   └── forms/
│   │       ├── OrgRegistrationForm/
│   │       ├── LicenceApplicationForm/
│   │       ├── QueryResponseForm/
│   │       └── RegistryEntryForm/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authSlice.ts
│   │   │   ├── LoginPage.tsx
│   │   │   └── hooks/
│   │   ├── registration/
│   │   │   ├── RegistrationPage.tsx
│   │   │   ├── RegistrationSuccess.tsx
│   │   │   └── registrationSlice.ts
│   │   ├── industry/
│   │   │   ├── dashboard/
│   │   │   │   └── IndustryDashboard.tsx
│   │   │   ├── applications/
│   │   │   │   ├── ApplicationList.tsx
│   │   │   │   ├── NewApplication.tsx
│   │   │   │   ├── ApplicationDetail.tsx
│   │   │   │   └── QueryResponse.tsx
│   │   │   ├── certificates/
│   │   │   │   ├── CertificateList.tsx
│   │   │   │   └── CertificateDownload.tsx
│   │   │   └── profile/
│   │   │       └── ProfilePage.tsx
│   │   ├── officer/
│   │   │   ├── dashboard/
│   │   │   │   └── OfficerDashboard.tsx
│   │   │   ├── registrations/
│   │   │   │   ├── PendingRegistrations.tsx
│   │   │   │   └── RegistrationReview.tsx
│   │   │   ├── applications/
│   │   │   │   ├── ApplicationQueue.tsx
│   │   │   │   ├── ApplicationReview.tsx
│   │   │   │   └── QueryManagement.tsx
│   │   │   └── registry/
│   │   │       └── RegistrySearch.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── AdminDashboard.tsx
│   │   │   ├── users/
│   │   │   │   └── UserManagement.tsx
│   │   │   ├── masterdata/
│   │   │   │   └── MasterDataManagement.tsx
│   │   │   ├── workflow/
│   │   │   │   └── WorkflowConfig.tsx
│   │   │   ├── registry/
│   │   │   │   └── RegistryManagement.tsx
│   │   │   └── audit/
│   │   │       └── AuditLogs.tsx
│   │   └── registry/
│   │       ├── DrugRegistry.tsx
│   │       ├── DeviceRegistry.tsx
│   │       ├── BloodBankRegistry.tsx
│   │       ├── CosmeticRegistry.tsx
│   │       ├── ManufacturerRegistry.tsx
│   │       ├── LabRegistry.tsx
│   │       └── ExpertRegistry.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNotifications.ts
│   │   ├── useWorkflow.ts
│   │   └── useFileUpload.ts
│   ├── services/
│   │   ├── api.ts                  # Axios base configuration
│   │   ├── authService.ts
│   │   ├── organizationService.ts
│   │   ├── licenceService.ts
│   │   ├── workflowService.ts
│   │   ├── registryService.ts
│   │   ├── certificateService.ts
│   │   ├── dashboardService.ts
│   │   └── notificationService.ts
│   ├── theme/
│   │   ├── theme.ts                # MUI theme config
│   │   ├── colors.ts               # CDSCO brand palette
│   │   └── typography.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── mockData.ts             # Demo seed data
│   └── types/
│       ├── organization.types.ts
│       ├── application.types.ts
│       ├── workflow.types.ts
│       ├── registry.types.ts
│       └── certificate.types.ts
```

### Design System & Theme

**Color Palette (CDSCO Brand)**
- Primary: `#1A3C6E` (Deep Government Blue)
- Secondary: `#FF6B35` (Saffron — Indian identity)
- Accent: `#00B894` (Approval Green)
- Warning: `#FDCB6E`
- Error: `#E17055`
- Background: `#F0F4F8` (Light gray-blue)
- Surface: `#FFFFFF` with glassmorphism overlays

**Typography**: Inter (Google Fonts) — weights 300, 400, 500, 600, 700

**Key Design Patterns**:
- Glassmorphism cards: `backdrop-filter: blur(10px)` with subtle border
- Gradient headers: `linear-gradient(135deg, #1A3C6E 0%, #2196F3 100%)`
- Animated workflow timeline with status indicators
- Framer Motion page transitions
- Skeleton loading states
- Confetti animation on certificate issuance

---

## 8. Backend Service Implementation Plan

### 8.1 Spring Boot Project Structure (per service)
```
{service-name}/
├── src/main/java/in/gov/cdsco/{service}/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── KafkaConfig.java
│   │   └── OpenApiConfig.java
│   ├── controller/
│   │   └── {Entity}Controller.java
│   ├── service/
│   │   ├── {Entity}Service.java
│   │   └── impl/{Entity}ServiceImpl.java
│   ├── repository/
│   │   └── {Entity}Repository.java
│   ├── domain/
│   │   ├── entity/
│   │   ├── enums/
│   │   └── valueobject/
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   ├── mapper/
│   │   └── {Entity}Mapper.java      # MapStruct
│   ├── event/
│   │   ├── producer/
│   │   └── consumer/
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── {Domain}Exception.java
│   └── util/
│       └── Constants.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-demo.yml         # Demo/mock mode
│   └── db/migration/               # Flyway scripts
└── src/test/
    ├── unit/
    └── integration/
```

### 8.2 Workflow State Machine

```
[DRAFT] ──submit──► [SUBMITTED] ──assign──► [SCRUTINY]
                                                │
                                    ┌───────────┼───────────┐
                                    │           │           │
                                [QUERY]    [REJECTED]  [TECHNICAL_REVIEW]
                                    │                       │
                              [RESPONSE_SUBMITTED]     [APPROVED]
                                    │                       │
                                    └──────────────► [CERTIFICATE_ISSUED]
                                                            │
                                                        [CLOSED]
```

Each transition is:
1. Validated against allowed transitions
2. Logged in `workflow_history`
3. Published as Kafka event (mocked in demo)
4. Notification sent to relevant users

### 8.3 Certificate Generation Pipeline

```java
// Certificate generation flow:
// 1. Receive certificate generation request
// 2. Validate application is APPROVED
// 3. Generate unique certificate number: CDSCO/{YEAR}/{TYPE}/{SEQUENCE}
// 4. Generate QR code (ZXing) with verification URL
// 5. Load Jasper template with:
//    - GoI emblem
//    - CDSCO logo
//    - Certificate details
//    - QR code
//    - Officer's digital signature image
// 6. Export to PDF bytes
// 7. Upload PDF to MinIO
// 8. Store certificate record in DB
// 9. Publish CERTIFICATE_ISSUED Kafka event
// 10. Update application status to CERTIFICATE_ISSUED
// 11. Send notification to org
```

---

## 9. Workflow Engine Design

### Stage Definitions
```yaml
workflow:
  definitions:
    - id: LICENCE_WORKFLOW
      stages:
        - id: DRAFT
          label: "Draft"
          description: "Application being prepared"
          allowed_transitions: [SUBMITTED]
          actor: INDUSTRY
        - id: SUBMITTED
          label: "Submitted"
          description: "Application submitted for review"
          sla_days: 2
          allowed_transitions: [SCRUTINY]
          actor: CDSCO_OFFICER
        - id: SCRUTINY
          label: "Scrutiny"
          description: "Document scrutiny in progress"
          sla_days: 7
          allowed_transitions: [QUERY_RAISED, TECHNICAL_REVIEW, REJECTED]
          actor: CDSCO_OFFICER
        - id: QUERY_RAISED
          label: "Query Raised"
          description: "Query raised to applicant"
          sla_days: 30
          allowed_transitions: [RESPONSE_SUBMITTED]
          actor: INDUSTRY
        - id: RESPONSE_SUBMITTED
          label: "Response Submitted"
          description: "Applicant responded to query"
          allowed_transitions: [TECHNICAL_REVIEW, QUERY_RAISED, REJECTED]
          actor: CDSCO_OFFICER
        - id: TECHNICAL_REVIEW
          label: "Technical Review"
          description: "Expert technical review"
          sla_days: 14
          allowed_transitions: [APPROVED, REJECTED]
          actor: CDSCO_SENIOR
        - id: APPROVED
          label: "Approved"
          description: "Application approved"
          allowed_transitions: [CERTIFICATE_ISSUED]
          actor: CDSCO_OFFICER
        - id: CERTIFICATE_ISSUED
          label: "Certificate Issued"
          description: "Digital certificate generated"
          allowed_transitions: [CLOSED]
        - id: REJECTED
          label: "Rejected"
          description: "Application rejected"
          terminal: true
        - id: CLOSED
          label: "Closed"
          description: "Process complete"
          terminal: true
```

---

## 10. Demo Data Specification

### Organizations (10)
| # | Name | Type | State |
|---|---|---|---|
| 1 | Sun Pharmaceuticals Ltd | PHARMA | Maharashtra |
| 2 | Cipla India Pvt Ltd | PHARMA | Maharashtra |
| 3 | Bharat Biotech International | PHARMA | Telangana |
| 4 | Siemens Healthineers India | DEVICE | Karnataka |
| 5 | Himalaya Drug Company | COSMETIC | Karnataka |
| 6 | Rotary Blood Bank Delhi | BLOOD_BANK | Delhi |
| 7 | Quintiles Transnational India | CRO | Maharashtra |
| 8 | Central Drugs Testing Lab Mumbai | LAB | Maharashtra |
| 9 | Johnson & Johnson MedTech India | DEVICE | Maharashtra |
| 10 | Mankind Pharma Ltd | PHARMA | Delhi |

### Sample Drug Products (200 seeded in DB)
- Categories: Allopathic (150), Biologicals (20), Vaccines (15), FDC (10), Veterinary (5)

### Applications (50 seeded)
- Status distribution: 10 Draft, 5 Submitted, 8 Scrutiny, 5 Query Raised, 2 Response Submitted, 8 Approved, 10 Certificate Issued, 2 Rejected

### Certificates (50 generated PDFs)
- Types: Drug Import Licence, Manufacturing Licence, Medical Device Licence, Cosmetic Licence, Blood Product Licence

---

## 11. Infrastructure & Deployment

### 11.1 Docker Compose (Demo Mode)
```yaml
# docker-compose.yml — All services + infrastructure in one command
services:
  # Infrastructure
  postgres:         # All service DBs as separate schemas
  kafka:            # KRaft mode, no Zookeeper
  redis:
  minio:
  keycloak:         # Pre-configured with CDSCO realm
  opensearch:
  nginx:            # API gateway + frontend serving

  # Application Services
  identity-service:
  organization-service:
  licence-service:
  workflow-service:
  registry-service:
  certificate-service:
  notification-service:
  document-service:
  dashboard-service:
  master-data-service:
  audit-service:
  search-service:

  # Demo Tools
  data-loader:      # Runs once, seeds all demo data
  pgadmin:          # DB visualization
  kafka-ui:         # Kafka event visualization
```

### 11.2 Kubernetes Structure (Production-ready Helm charts)
```
kubernetes/
├── helm/
│   └── ddrs/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-demo.yaml
│       └── templates/
│           ├── deployments/
│           ├── services/
│           ├── configmaps/
│           ├── secrets/
│           ├── ingress/
│           └── hpa/
├── namespaces/
├── rbac/
└── monitoring/
    ├── grafana/
    └── prometheus/
```

### 11.3 Observability Stack
- **OpenTelemetry** agent on each Spring Boot service
- **Grafana** dashboards for service health, latency, throughput
- **Prometheus** metrics scraping
- **Structured JSON logging** with correlation IDs

---

## 12. Security Implementation

| Layer | Implementation |
|---|---|
| Authentication | Keycloak OIDC, JWT Bearer tokens |
| Authorization | Spring Security, Role-based (`@PreAuthorize`) |
| API Security | CORS policy, CSRF protection, Rate limiting |
| Data Encryption | AES-256 at rest (MinIO), TLS 1.3 in transit |
| Input Validation | Bean Validation, Yup (frontend), SQL injection prevention |
| Audit Trail | Immutable audit log for all state changes |
| Secret Management | Kubernetes Secrets / Vault-ready |
| OWASP Compliance | XSS headers, Content-Security-Policy, HSTS |

---

## 13. Delivery Phases & Timeline

### Phase 1 — Foundation (Week 1-2)
- [ ] Project scaffolding (all 12 services + frontend)
- [ ] Database schema & Flyway migrations
- [ ] Docker Compose full stack setup
- [ ] Keycloak realm configuration (roles, clients)
- [ ] Design system (MUI theme, colors, typography)
- [ ] Login page, landing page
- [ ] API Gateway routing (Nginx)

### Phase 2 — Core Workflows (Week 3-4)
- [ ] Organization registration flow (Industry)
- [ ] CDSCO Officer review & approval flow
- [ ] Licence application creation & submission
- [ ] Document upload (MinIO integration)
- [ ] Workflow engine state machine
- [ ] Query raise & response cycle
- [ ] Basic Industry dashboard
- [ ] Basic Officer dashboard

### Phase 3 — Registries & Certificates (Week 5-6)
- [ ] All 7 registry modules (Drug, Device, Blood, Cosmetic, Manufacturer, Lab, Expert)
- [ ] Registry search (OpenSearch)
- [ ] Certificate generation (Jasper + QR code)
- [ ] Certificate PDF download
- [ ] QR code verification page
- [ ] Notifications (in-app + mock email/SMS)

### Phase 4 — Analytics & Polish (Week 7-8)
- [ ] Full analytics dashboards (all 3 roles)
- [ ] India map with state-wise distribution
- [ ] Animated workflow timeline component
- [ ] Framer Motion page transitions
- [ ] Certificate success animation
- [ ] Master data management (Admin)
- [ ] Audit logs viewer
- [ ] User management (Admin)

### Phase 5 — Demo Readiness (Week 9-10)
- [ ] Complete demo data loader (all seed data)
- [ ] Presentation mode (instant transitions)
- [ ] Mock Kafka event visualizer
- [ ] Sample certificates pre-generated
- [ ] Demo script for presentation
- [ ] Complete README & deployment guide
- [ ] Performance testing & optimization
- [ ] End-to-end demo rehearsal

---

## 14. Open Questions for Approval

> [!IMPORTANT]
> **Q1: Demo Deployment Target**  
> Should the demo run on a local laptop (Docker Compose) or on a cloud VM for the actual CDSCO presentation? This affects infrastructure sizing decisions.

> [!IMPORTANT]
> **Q2: Development Priority Order**  
> Should we start building the full stack (frontend + backend together per feature), or build all backend services first and then the frontend? Recommend: **feature-by-feature full stack** for faster visible progress.

> [!WARNING]
> **Q3: Keycloak vs. Mock Auth**  
> Embedded Keycloak adds realism but increases demo complexity. As an alternative, we can implement a simulated auth service that mimics Keycloak behavior for the demo. **Recommend: Mock auth service with Keycloak-compatible JWT for demo simplicity.**

> [!NOTE]
> **Q4: Real Kafka vs. In-Memory Events**  
> For the demo, Kafka events can be simulated with an in-memory event bus (Spring ApplicationEvents), keeping the architecture clean but reducing external dependencies. A real Kafka instance can be included in Docker Compose if needed.

> [!NOTE]
> **Q5: Certificate Digital Signature**  
> Real PKI-based digital signatures require HSM/DSC integration. For the demo, we recommend a **visual mock digital signature** (image of signature + DSC placeholder) that looks authentic without requiring real cryptographic infrastructure.

---

## 15. Verification Plan

### Automated Testing
```bash
# Backend: Run all unit + integration tests
mvn test -pl services/...

# Frontend: Component + E2E tests
npm run test
npx cypress run

# Contract tests (Pact)
mvn verify -Pcontract-tests
```

### Manual Demo Verification Checklist
- [ ] Registration → Approval → Login flow completes without errors
- [ ] Licence application submits and moves through all workflow stages
- [ ] Query raise and response cycle works correctly
- [ ] Certificate generates as downloadable PDF with QR code
- [ ] QR code scan verifies certificate authenticity
- [ ] All 3 dashboards display correct charts and data
- [ ] All 7 registry modules show realistic seeded data
- [ ] State-wise map renders with distribution data
- [ ] Notifications appear in real-time (mock WebSocket)
- [ ] Docker Compose starts entire stack with `docker compose up -d`
- [ ] Demo data loads automatically on first run

---

## 16. Future Roadmap (Post-Demo → Production)

| Feature | Priority | Notes |
|---|---|---|
| Real Keycloak + DSC integration | P0 | Replace mock auth |
| Sunbird RC integration | P0 | Real registry backend |
| DIGIT Workflow engine | P0 | Replace custom workflow |
| HAPI FHIR for drug data | P1 | Standards compliance |
| OpenFn integration | P1 | External system data flows |
| Payment gateway integration | P1 | Fee payment |
| State drug controller portal | P1 | State-level officers |
| Mobile application (PWA/App) | P2 | Field inspections |
| AI-powered document analysis | P2 | Auto-scrutiny |
| Blockchain audit trail | P3 | Tamper-proof records |
| Multi-language support | P2 | Hindi + 22 regional languages |
| Offline capabilities | P3 | Remote area access |

---

*Plan prepared for: CDSCO Digital Drugs Regulatory System (DDRS) Demo*  
*Version: 1.0 | Date: July 2026*
