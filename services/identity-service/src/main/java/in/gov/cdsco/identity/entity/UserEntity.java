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

    @Column(name = "ddrs_user_id", unique = true)
    private String ddrsUserId;

    @Column(name = "user_type")
    private String userType;

    @Column(name = "cin_llpin")
    private String cinLlpin;

    @Column(name = "aadhaar_token")
    private String aadhaarToken;

    @Column(name = "designation")
    private String designation;

    @Column(name = "father_spouse_name")
    private String fatherSpouseName;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    @Column(name = "nationality")
    private String nationality;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "pharmacist_reg_no")
    private String pharmacistRegNo;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "mobile_otp_verified")
    private Boolean mobileOtpVerified = false;

    @Column(name = "email_otp_verified")
    private Boolean emailOtpVerified = false;

    @Column(name = "registration_status")
    private String registrationStatus = "PENDING_OTP";

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
