package in.gov.cdsco.certificate.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "certificate_number", unique = true, nullable = false)
    private String certificateNumber;

    @Column(name = "application_id")
    private UUID applicationId;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "licence_type")
    private String licenceType;

    @Column(name = "certificate_type")
    private String certificateType;

    @Column(name = "issued_by_officer_id")
    private UUID issuedByOfficerId;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "qr_code_data")
    private String qrCodeData;

    @Column(name = "digital_signature")
    private String digitalSignature;

    @Column(name = "pdf_minio_key")
    private String pdfMinioKey;

    @Column(name = "status")
    private String status = "ACTIVE";

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "revocation_reason")
    private String revocationReason;

    @Column(name = "revoked_at")
    private ZonedDateTime revokedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = ZonedDateTime.now();
    }
}
