package in.gov.cdsco.licence.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "inspections")
public class InspectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "inspector_id")
    private UUID inspectorId;

    @Column(name = "inspection_type")
    private String inspectionType; // ROUTINE, FOR_CAUSE, PRE_LICENCE, JOINT

    @Column(name = "inspection_date")
    private LocalDate inspectionDate;

    @Column(name = "team_members", columnDefinition = "TEXT")
    private String teamMembers; // JSON array

    // GPS
    @Column(name = "gps_latitude")
    private Double gpsLatitude;

    @Column(name = "gps_longitude")
    private Double gpsLongitude;

    // Form 35 / MD-11 Checklist (full 20-item JSON)
    @Column(name = "checklist_json", columnDefinition = "TEXT")
    private String checklistJson;

    @Column(name = "critical_observations", columnDefinition = "TEXT")
    private String criticalObservations;

    @Column(name = "observation_severity")
    private String observationSeverity; // CRITICAL, MAJOR, MINOR

    @Column(name = "inspection_report_url")
    private String inspectionReportUrl;

    @Column(name = "photo_urls_json", columnDefinition = "TEXT")
    private String photoUrlsJson; // JSON array of photo URLs (up to 20)

    // Decision
    @Column(name = "decision_status")
    private String decisionStatus; // APPROVED, APPROVED_WITH_CONDITIONS, REJECTED, DEFERRED

    @Column(name = "approval_conditions", columnDefinition = "TEXT")
    private String approvalConditions;

    @Column(name = "rejection_reason_code")
    private String rejectionReasonCode; // R01..R05

    @Column(name = "rejection_narrative", columnDefinition = "TEXT")
    private String rejectionNarrative;

    // Licence Issuance
    @Column(name = "rc_license_number", unique = true)
    private String rcLicenseNumber; // RC/CDSCO/YYYY/XXXXXXXX

    @Column(name = "license_validity_years")
    private Integer licenseValidityYears; // 1, 3, 5

    @Column(name = "license_issue_date")
    private LocalDate licenseIssueDate;

    @Column(name = "license_expiry_date")
    private LocalDate licenseExpiryDate;

    // Officer DSC
    @Column(name = "officer_signed")
    private Boolean officerSigned = false;

    @Column(name = "signing_officer_name")
    private String signingOfficerName;

    @Column(name = "signed_at")
    private java.time.ZonedDateTime signedAt;

    @Column(name = "status")
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
