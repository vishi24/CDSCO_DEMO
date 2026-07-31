package in.gov.cdsco.organization.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "organizations")
@Data
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "org_code", unique = true, nullable = false)
    private String orgCode;

    @Column(name = "org_name", nullable = false)
    private String orgName;

    @Column(name = "org_type", nullable = false)
    private String orgType;

    @Column(name = "gst_number", unique = true)
    private String gstNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "mobile", nullable = false)
    private String mobile;
    
    @Column(name = "state_code")
    private String stateCode;
    
    @Column(name = "city")
    private String city;

    @Column(name = "status")
    private String status = "PENDING_APPROVAL";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
