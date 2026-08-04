# Graph Report - .  (2026-08-04)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 756 nodes · 1159 edges · 68 communities (39 shown, 29 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `596b27f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LicenceApplication
- dependencies
- WorkflowInstance
- UserEntity
- routes.tsx
- devDependencies
- Certificate
- InspectionEntity
- NotificationEntity
- DrugProduct
- JpaRepository
- MasterDataEntity
- compilerOptions
- AuditLogEntity
- compilerOptions
- OtpService
- ApplicationReview.tsx
- DocumentController
- App.tsx
- SecurityConfig.java
- ApplicationList.tsx
- NewApplication.tsx
- RegistrationPage.tsx
- mvnw
- DashboardController
- LoginPage.tsx
- ApplicationDocument
- fix_ts2.cjs
- fix_typography.cjs
- ApplicationQueue.tsx
- MinioConfig.java
- fix_grid.cjs
- fix_ts.js
- LandingPage.tsx
- FakeEmailService
- FakeSmsService
- FakeGstnService
- FakeMcaService
- AdminServiceApplication
- AuditServiceApplication
- CertificateServiceApplication
- DashboardServiceApplication
- DocumentServiceApplication
- IdentityServiceApplication
- LicenceServiceApplication
- NotificationServiceApplication
- OrganizationServiceApplication
- RegistryServiceApplication
- WorkflowServiceApplication
- process_directory
- test_e2e.cjs
- tsconfig.json
- entrypoint.sh
- FakeNotificationService.ts
- init-db.sh
- admin-service
- audit-service
- certificate-service
- dashboard-service
- document-service
- identity-service
- in.gov.cdsco:ddrs-platform
- licence-service
- notification-service
- organization-service
- registry-service
- workflow-service

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `LicenceApplication` - 29 edges
3. `Certificate` - 20 edges
4. `compilerOptions` - 18 edges
5. `InspectionEntity` - 17 edges
6. `WorkflowInstance` - 17 edges
7. `LicenceApplicationService` - 16 edges
8. `compilerOptions` - 15 edges
9. `MasterDataEntity` - 15 edges
10. `AuditLogEntity` - 15 edges

## Surprising Connections (you probably didn't know these)
- `plugins` --extends--> `typescript`  [EXTRACTED]
  frontend/.oxlintrc.json → frontend/package.json
- `MasterDataController` --references--> `MasterDataRepository`  [EXTRACTED]
  services/admin-service/src/main/java/in/gov/cdsco/admin/controller/MasterDataController.java → services/admin-service/src/main/java/in/gov/cdsco/admin/repository/MasterDataRepository.java
- `MasterDataRepository` --references--> `MasterDataEntity`  [EXTRACTED]
  services/admin-service/src/main/java/in/gov/cdsco/admin/repository/MasterDataRepository.java → services/admin-service/src/main/java/in/gov/cdsco/admin/entity/MasterDataEntity.java
- `AuditLogController` --references--> `AuditLogRepository`  [EXTRACTED]
  services/audit-service/src/main/java/in/gov/cdsco/audit/controller/AuditLogController.java → services/audit-service/src/main/java/in/gov/cdsco/audit/repository/AuditLogRepository.java
- `AuditLogRepository` --references--> `AuditLogEntity`  [EXTRACTED]
  services/audit-service/src/main/java/in/gov/cdsco/audit/repository/AuditLogRepository.java → services/audit-service/src/main/java/in/gov/cdsco/audit/entity/AuditLogEntity.java

## Import Cycles
- None detected.

## Communities (68 total, 29 thin omitted)

### Community 0 - "LicenceApplication"
Cohesion: 0.08
Nodes (24): PatchMapping, GetMapping, PostMapping, RequestMapping, ResponseEntity, RestController, LicenceApplicationController, Data (+16 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (47): axios, chart.js, dayjs, @emotion/react, @emotion/styled, formik, framer-motion, dependencies (+39 more)

### Community 2 - "WorkflowInstance"
Cohesion: 0.08
Nodes (26): GetMapping, PostMapping, RequestMapping, ResponseEntity, RestController, WorkflowController, Data, Entity (+18 more)

### Community 3 - "UserEntity"
Cohesion: 0.10
Nodes (23): Builder, SecretKey, AuthController, GetMapping, PasswordEncoder, PostMapping, RequestMapping, RequiredArgsConstructor (+15 more)

### Community 4 - "routes.tsx"
Cohesion: 0.10
Nodes (19): AppHeader(), Notification, NotificationBell(), AuditLog, AuditLogs(), AdminDashboard(), COLORS, MasterData (+11 more)

### Community 5 - "devDependencies"
Cohesion: 0.06
Nodes (31): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, devDependencies, oxlint, @types/node (+23 more)

### Community 6 - "Certificate"
Cohesion: 0.13
Nodes (17): CertificateController, GetMapping, PostMapping, RequestMapping, ResponseEntity, RestController, Certificate, Data (+9 more)

### Community 7 - "InspectionEntity"
Cohesion: 0.15
Nodes (15): InspectionController, GetMapping, PostMapping, RequestMapping, ResponseEntity, RestController, InspectionEntity, Data (+7 more)

### Community 8 - "NotificationEntity"
Cohesion: 0.13
Nodes (15): GetMapping, PostMapping, PutMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, NotificationController (+7 more)

### Community 9 - "DrugProduct"
Cohesion: 0.13
Nodes (17): GetMapping, PostMapping, RequestMapping, ResponseEntity, RestController, RegistryController, DrugProduct, Data (+9 more)

### Community 10 - "JpaRepository"
Cohesion: 0.15
Nodes (16): DataIntegrityViolationException, ExceptionHandler, JpaRepository, CrossOrigin, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor (+8 more)

### Community 11 - "MasterDataEntity"
Cohesion: 0.13
Nodes (15): GetMapping, PostMapping, PutMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, MasterDataController (+7 more)

### Community 12 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 13 - "AuditLogEntity"
Cohesion: 0.16
Nodes (13): AuditLogController, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, AuditLogEntity (+5 more)

### Community 14 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 15 - "OtpService"
Cohesion: 0.23
Nodes (9): PostMapping, RequestMapping, ResponseEntity, RestController, OtpController, Logger, Service, OtpEntry (+1 more)

### Community 16 - "ApplicationReview.tsx"
Cohesion: 0.16
Nodes (10): ApplicationReview(), TabPanelProps, GeotagCapture(), GeotagCaptureProps, LocationData, CHECKLIST_ITEMS, InspectionChecklist(), InspectionChecklistProps (+2 more)

### Community 17 - "DocumentController"
Cohesion: 0.20
Nodes (11): MultipartFile, PostConstruct, DocumentController, CrossOrigin, MinioClient, PostMapping, RequestMapping, RequiredArgsConstructor (+3 more)

### Community 18 - "App.tsx"
Cohesion: 0.21
Nodes (8): App(), queryClient, AppRoutes(), AppDispatch, RootState, store, cdscoColors, theme

### Community 19 - "SecurityConfig.java"
Cohesion: 0.32
Nodes (8): CorsConfigurationSource, EnableWebSecurity, HttpSecurity, SecurityFilterChain, Bean, Configuration, PasswordEncoder, SecurityConfig

### Community 20 - "ApplicationList.tsx"
Cohesion: 0.23
Nodes (9): ApplicantStatusDashboard(), ApplicationStatus, DashboardProps, ApplicationList(), getStatusColor(), STATUS_ORDER, ApplicationTimeline(), ApplicationTimelineProps (+1 more)

### Community 21 - "NewApplication.tsx"
Cohesion: 0.22
Nodes (9): calcFee(), FEE_MATRIX, FOREIGN_APPROVALS, initialValues, NewApplication(), steps, validationSchemas, PaymentSimulator() (+1 more)

### Community 22 - "RegistrationPage.tsx"
Cohesion: 0.22
Nodes (8): OtpVerificationStep(), OtpVerificationStepProps, ProfileDetailsStep(), ProfileDetailsStepProps, initialValues, RegistrationPage(), steps, validationSchemas

### Community 23 - "mvnw"
Cohesion: 0.33
Nodes (6): mvnw script, clean(), die(), exec_maven(), set_java_home(), verbose()

### Community 24 - "DashboardController"
Cohesion: 0.36
Nodes (5): DashboardController, GetMapping, RequestMapping, ResponseEntity, RestController

### Community 25 - "LoginPage.tsx"
Cohesion: 0.25
Nodes (6): authSlice, AuthState, initialState, DEMO_USERS, DemoUser, LoginPage()

### Community 26 - "ApplicationDocument"
Cohesion: 0.32
Nodes (6): ApplicationDocument, Data, Entity, NoArgsConstructor, PrePersist, Table

### Community 27 - "fix_ts2.cjs"
Cohesion: 0.33
Nodes (4): appReviewPath, fs, inspectionChecklistPath, path

### Community 28 - "fix_typography.cjs"
Cohesion: 0.40
Nodes (5): dirSrc, fs, path, processFile(), walk()

### Community 29 - "ApplicationQueue.tsx"
Cohesion: 0.47
Nodes (5): ApplicationQueue(), CATEGORY_FILTERS, getPriority(), getStatusColor(), STATUS_FILTERS

### Community 30 - "MinioConfig.java"
Cohesion: 0.53
Nodes (4): Bean, Configuration, MinioClient, MinioConfig

### Community 31 - "fix_grid.cjs"
Cohesion: 0.50
Nodes (4): fs, path, processDirectory(), processFile()

### Community 32 - "fix_ts.js"
Cohesion: 0.40
Nodes (3): appReviewPath, fs, path

### Community 33 - "LandingPage.tsx"
Cohesion: 0.40
Nodes (4): features, LandingPage(), MotionBox, stats

### Community 34 - "FakeEmailService"
Cohesion: 0.60
Nodes (3): FakeEmailService, Logger, Service

### Community 35 - "FakeSmsService"
Cohesion: 0.60
Nodes (3): FakeSmsService, Logger, Service

### Community 36 - "FakeGstnService"
Cohesion: 0.60
Nodes (3): FakeGstnService, Logger, Service

### Community 37 - "FakeMcaService"
Cohesion: 0.60
Nodes (3): FakeMcaService, Logger, Service

## Knowledge Gaps
- **143 isolated node(s):** `entrypoint.sh script`, `$schema`, `oxc`, `react/rules-of-hooks`, `warn` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `routes.tsx` to `LandingPage.tsx`, `devDependencies`, `ApplicationReview.tsx`, `App.tsx`, `ApplicationList.tsx`, `NewApplication.tsx`, `RegistrationPage.tsx`, `LoginPage.tsx`, `ApplicationQueue.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `LicenceApplicationRepository` connect `LicenceApplication` to `JpaRepository`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `plugins` connect `devDependencies` to `routes.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `entrypoint.sh script`, `$schema`, `oxc` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `LicenceApplication` be split into smaller, more focused modules?**
  _Cohesion score 0.08490566037735849 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `WorkflowInstance` be split into smaller, more focused modules?**
  _Cohesion score 0.08484848484848485 - nodes in this community are weakly interconnected._