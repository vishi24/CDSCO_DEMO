package in.gov.cdsco.notification.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class NotificationEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(name = "recipient_user_id", nullable = false)
    private UUID recipientUserId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;
    
    @Column(nullable = false)
    private String type; // INFO, WARNING, SUCCESS, ERROR

    @Column(name = "channel")
    private String channel = "IN_APP"; // IN_APP, SMS_FAKE, EMAIL_FAKE

    @Column(name = "reference_id")
    private String referenceId;

    @Column(name = "is_read")
    private boolean read = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
