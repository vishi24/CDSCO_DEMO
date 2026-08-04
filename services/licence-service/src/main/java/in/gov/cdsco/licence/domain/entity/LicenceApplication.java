package in.gov.cdsco.licence.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "licence_applications")
public class LicenceApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "application_number", unique = true, nullable = false)
    private String applicationNumber;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "licence_type", nullable = false)
    private String licenceType;

    @Column(name = "sub_category")
    private String subCategory;

    @Column(name = "application_date")
    private ZonedDateTime applicationDate;

    @Column(name = "current_status")
    private String currentStatus = "DRAFT";

    @Column(name = "assigned_officer_id")
    private UUID assignedOfficerId;

    @Column(name = "fee_amount")
    private BigDecimal feeAmount;

    @Column(name = "fee_paid")
    private Boolean feePaid = false;

    @Column(name = "fee_receipt_number")
    private String feeReceiptNumber;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "priority")
    private String priority = "NORMAL";

    // --- FORM 40 Specific Fields ---

    // Case Details
    @Column(name = "case_type")
    private String caseType;              // FRESH, ENDORSEMENT, RE_REGISTRATION

    @Column(name = "previous_rc_number")
    private String previousRcNumber;

    // Drug Identification
    @Column(name = "drug_name")
    private String drugName;

    @Column(name = "generic_name")
    private String genericName;           // INN

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "drug_class")
    private String drugClass;

    @Column(name = "pharmacopoeia")
    private String pharmacopoeia;

    @Column(name = "dosage_form")
    private String dosageForm;

    @Column(name = "strength_composition")
    private String strengthComposition;

    @Column(name = "route_of_administration")
    private String routeOfAdministration;

    @Column(name = "therapeutic_category")
    private String therapeuticCategory;   // WHO ATC

    @Column(name = "proposed_indications", columnDefinition = "TEXT")
    private String proposedIndications;

    @Column(name = "pack_size")
    private String packSize;

    @Column(name = "storage_conditions")
    private String storageConditions;

    @Column(name = "shelf_life")
    private String shelfLife;

    // Manufacturer Details
    @Column(name = "manufacturer_name")
    private String manufacturerName;

    @Column(name = "manufacturing_site_id")
    private String manufacturingSiteId;

    @Column(name = "manufacturing_site_address", columnDefinition = "TEXT")
    private String manufacturingSiteAddress;

    @Column(name = "country_of_origin")
    private String countryOfOrigin;

    @Column(name = "manufacturing_license_number")
    private String manufacturingLicenseNumber;

    @Column(name = "approval_status_origin_country")
    private String approvalStatusOriginCountry;

    @Column(name = "foreign_regulatory_approvals", columnDefinition = "TEXT")
    private String foreignRegulatoryApprovals; // JSON array as text

    // Fee and Payment
    @Column(name = "application_fee")
    private java.math.BigDecimal applicationFee;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "payment_reference")
    private String paymentReference;       // UTR

    @Column(name = "payment_date")
    private ZonedDateTime paymentDate;

    // Submission & Signing
    @Column(name = "arn_number", unique = true)
    private String arnNumber;             // ARN/CDSCO/YYYY/XXXXXXXX

    @Column(name = "applicant_dsc_token")
    private String applicantDscToken;

    @Column(name = "digital_signed")
    private Boolean digitalSigned = false;

    @Column(name = "signatory_name")
    private String signatoryName;

    @Column(name = "dsc_signed_at")
    private ZonedDateTime dscSignedAt;

    // Officer Tracking
    @Column(name = "assigned_officer_name")
    private String assignedOfficerName;

    @Column(name = "assignment_date")
    private ZonedDateTime assignmentDate;

    @Column(name = "scrutiny_status")
    private String scrutinyStatus;

    @Column(name = "deficiency_remarks", columnDefinition = "TEXT")
    private String deficiencyRemarks;

    @Column(name = "applicant_response_deadline")
    private LocalDate applicantResponseDeadline;
    // --------------------------------

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "submitted_at")
    private ZonedDateTime submittedAt;

    @Column(name = "approved_at")
    private ZonedDateTime approvedAt;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @PrePersist
    protected void onCreate() {
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = ZonedDateTime.now();
        this.applicationDate = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = ZonedDateTime.now();
    }
}
