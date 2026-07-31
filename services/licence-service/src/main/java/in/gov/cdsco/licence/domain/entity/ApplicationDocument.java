package in.gov.cdsco.licence.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "application_documents")
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "application_id", nullable = false)
    private UUID applicationId;

    @Column(name = "document_type")
    private String documentType;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "minio_key")
    private String minioKey;

    @Column(name = "is_mandatory")
    private Boolean isMandatory = true;

    @Column(name = "uploaded_at", updatable = false)
    private ZonedDateTime uploadedAt;

    @Column(name = "uploaded_by")
    private UUID uploadedBy;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = ZonedDateTime.now();
    }
}
