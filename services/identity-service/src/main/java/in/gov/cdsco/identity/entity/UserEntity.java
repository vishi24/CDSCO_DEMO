package in.gov.cdsco.identity.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class UserEntity {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(name = "keycloak_user_id", unique = true)
    private String keycloakUserId;

    @Column(name = "organization_id")
    private UUID organizationId;

    @Column(name = "full_name")
    private String fullName;

    @Column(unique = true)
    private String email;

    private String mobile;

    private String role;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "last_login")
    private ZonedDateTime lastLogin;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = ZonedDateTime.now();
        if(this.keycloakUserId == null) {
            this.keycloakUserId = UUID.randomUUID().toString();
        }
    }
}
