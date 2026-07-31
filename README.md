# Digital Drugs Regulatory System (DDRS)

A comprehensive, microservices-based portal for the Central Drugs Standard Control Organisation (CDSCO), Government of India. This application digitizes and unifies the regulatory workflows for drug licensing, medical device registration, laboratory certification, and cross-registry search.

## Features Included in the Demo

1. **Authentication & Authorization (Role-Based)**
   - Roles: `INDUSTRY`, `CDSCO_OFFICER`, `CDSCO_SENIOR`, `ADMIN`.
   - Uses Mock Keycloak-compatible JWTs via an in-house Identity Service.

2. **Organization Management**
   - Industry users can register organizations.
   - Officers can approve or reject organizations.

3. **Licence Workflow (DIGIT-like Engine)**
   - Stage transitions (Draft → Submitted → Scrutiny → Query → Approved → Certificate Issued).
   - In-memory event bus (Spring `ApplicationEvents`) powering the workflow state machine.

4. **Digital Certificates**
   - PDF Generation via Jasper Reports.
   - Dynamic QR codes (ZXing) embedded in certificates for verification.
   - Visual mock Digital Signature Certificate (DSC) watermarks.

5. **Registries & Search**
   - 7 distinct registries: Drugs, Medical Devices, Blood Banks, Cosmetics, Manufacturers, Testing Labs, and Subject Matter Experts.

6. **Dashboards & Analytics**
   - Custom dashboards for Industry users, CDSCO Officers, and Administrators.
   - Aggregated KPIs, charts, and state-wise geographic distributions.

7. **Audit & Notifications**
   - Immutable Audit Logs via the Audit Service.
   - Real-time Server-Sent Events (SSE) pushing instant in-app notifications to the global `<AppHeader />` bell.

8. **Presentation & Demo Mode**
   - Seamless data loading (50+ certificates, 200+ drugs, 10 orgs).
   - Hidden `/demo` control panel to trigger SSE notifications and reset data.
   - Framer Motion UI transitions for a polished feel.

## Architecture

The DDRS is built on a modern stack:
- **Frontend**: React 18, TypeScript, Material UI (v5), Redux Toolkit, Framer Motion.
- **Backend**: Java 21, Spring Boot 3.3.x, Spring Data JPA.
- **Infrastructure**: Docker Compose, PostgreSQL 16, MinIO, Redis, Nginx (API Gateway).

## Getting Started

To run the entire application stack locally:

```bash
# 1. Clone the repository
git clone https://github.com/cdsco/ddrs-platform.git
cd ddrs-platform

# 2. Build and start all services via Docker Compose
docker-compose up -d --build
```

### Accessing the Portal

- **Frontend Application**: [http://localhost](http://localhost)
- **Demo Control Panel**: [http://localhost/demo](http://localhost/demo) (Login as Admin)

### Demo Credentials

Select a user from the dropdown on the Login Page:
- `admin@sunpharma.com` (Industry Applicant)
- `officer@cdsco.gov.in` (CDSCO Officer)
- `senior@cdsco.gov.in` (Senior Reviewer)
- `admin@cdsco.gov.in` (System Administrator)

## Project Structure

- `/frontend`: React SPA source code.
- `/services`: Spring Boot microservices (Identity, Organization, Licence, Workflow, Certificate, Registry, Dashboard, Master Data, Audit, Notification, Document).
- `/nginx`: Nginx API gateway configuration.
- `/data-loader`: Seed scripts that execute on container startup to populate the demo environment.

---
*Developed for the Government of India, Ministry of Health & Family Welfare (CDSCO).*
