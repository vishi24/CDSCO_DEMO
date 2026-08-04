# DDRS (Digital Drugs Regulatory System) - CDSCO Demo

This repository contains a demonstration of the Digital Drugs Regulatory System (DDRS), a modernized platform for the Central Drugs Standard Control Organisation (CDSCO). The system features a microservices-based backend architecture and a responsive React frontend, designed to handle organizational registrations, drug manufacturing licence applications, and workflow management.

## 1. How to Setup on Local System

### Prerequisites
- **Docker** & **Docker Compose**: Required to run the backend microservices, NGINX API gateway, and PostgreSQL databases.
- **Node.js** (v18+) & **npm**: Required to run the React frontend development server.

### Backend Setup
The backend consists of multiple Spring Boot microservices and a PostgreSQL database, all orchestrated via Docker Compose.

1. Open your terminal or command prompt.
2. Navigate to the root of the project directory (`CDSCO_DEMO`).
3. Run the following command to build and start all backend containers in detached mode:
   ```bash
   docker-compose up -d --build
   ```
4. Verify that all containers are running successfully using `docker ps`. You should see containers for the database, NGINX, and various microservices (identity, organization, licence, etc.).

### Frontend Setup
The frontend is a modern Single Page Application (SPA) built with React and Vite.

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the necessary Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The application will be available at **`http://localhost:3000`**.

---

## 2. System Flow

The architecture follows a standard API Gateway pattern utilizing microservices for high scalability and separation of concerns.

1. **Frontend (React + Vite)**: 
   - Runs locally on port 3000.
   - All API calls are prefixed with `/api/v1/`. The Vite development server acts as a local proxy, forwarding these requests to the NGINX API Gateway.
2. **API Gateway (NGINX)**:
   - Runs in a Docker container on port 80.
   - Acts as the single entry point for all API requests.
   - Routes incoming requests to the appropriate internal microservice based on the URL path (e.g., `/api/v1/auth/` routes to the `identity-service`, `/api/v1/organizations` routes to the `organization-service`).
3. **Microservices (Spring Boot + Java 21)**:
   - **Identity Service**: Manages users, JWT generation, and authentication.
   - **Organization Service**: Handles organization registration, approval workflows, and organization-level data.
   - **Licence Service**: Manages the lifecycle of drug applications (Form 40), processing, and approvals.
   - **Notification Service**: Manages alerts and dummy integrations for SMS/Email notifications.
   - *(Other services include workflow, document, certificate, registry, dashboard, admin, and audit).*
4. **Database (PostgreSQL)**:
   - A single PostgreSQL container hosts multiple logical databases (e.g., `ddrs_identity`, `ddrs_organizations`, `ddrs_licences`).
   - Database schemas are strictly managed and version-controlled automatically upon startup using **Flyway** migrations.

---

## 3. End User Manual

### Overview
This demo supports the end-to-end journey of an Industry User interacting with the CDSCO portal to register their organization and apply for a drug manufacturing licence. 

*(Note: For this demo, external integrations such as SMS, Email, OTP verification, Bharat Kosh payments, MCA, and Aadhaar have been mocked with dummy functionality).*

### A. Organization Registration
1. Navigate to the **Register** page from the main landing screen (`http://localhost:3000/register`).
2. Fill out the **Organization Details** (e.g., Manufacturer, Organization Name, PAN, GST).
3. Provide the **Authorised Signatory** details. For the Aadhaar Token field, you can enter any 12-digit number (e.g., `123456789012`).
4. Enter your **Contact Credentials** (Mobile, Email, Password).
5. Complete the dummy OTP verification process.
6. Review the information and accept the declaration to submit the registration. The organization will be created in a `PENDING_APPROVAL` status.

### B. User Login
Users can log in immediately after successful registration. For demonstration purposes, the database is also pre-seeded with verified accounts:

**Industry User (Applicant):**
- **Email:** `industry@example.com`
- **Password:** `password`

**CDSCO Officer (Reviewer):**
- **Email:** `officer@cdsco.gov.in`
- **Password:** `password`

### C. Submitting a New Drug Application
1. Once logged in as the industry user, navigate to the **Applications** section and click on **New Application**.
2. **Application Type**: Select "Fresh Application" and choose the Drug Category (e.g., New Drug, Generic, FDC). The application fee will be auto-calculated based on your selection.
3. **Drug Details**: Fill in the required medical properties (Generic Name, Brand Name, Dosage Form, Therapeutic Category, etc.).
4. **Manufacturer Info**: Input your manufacturing site license number and declare any Foreign Regulatory Approvals.
5. **Documents Upload**: For this demo, no real file uploads are required; you may skip or use placeholder PDFs.
6. **Fee & Payment**: Use the dummy "Payment Simulator" to bypass Bharat Kosh payment processing and instantly generate a UTR payment reference.
7. **Digital Signature (DSC)**: When prompted for the DSC Token PIN, use the demo hint PIN: **`123456`**.
8. **Review & Submit**: Submit the final application. You will receive an Application Reference Number (ARN), and the application status will change to `DRAFT` or `SUBMITTED`.

### D. Officer Review Workflow
1. Log in using the **CDSCO Officer** credentials.
2. Navigate to the **Application Queue** to see pending applications.
3. **Document Scrutiny**: Review application details and mark the scrutiny status (e.g., Acceptable, Query Raised).
4. **Field Inspection**: Schedule inspections, record checklist results, capture geotagged coordinates, and submit the inspection report.
5. **Decision & Issuance**: Approve or reject the application. Upon approval (use DSC PIN `123456`), a Registration Certificate (RC) number is generated and the digital licence card is issued.

---

## 4. Developer Tooling (MCP)

This project is configured to work seamlessly with Model Context Protocol (MCP) servers:
- **Graphify**: Generates a rich semantic knowledge graph of the microservices architecture, allowing the AI to query dependencies, API routes, and database schemas instantly without loading the entire codebase.
- **Headroom**: An intelligent context-compression proxy that minimizes token usage when communicating with large language models during development.
