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
