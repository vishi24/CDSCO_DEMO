package in.gov.cdsco.notification.repository;

import in.gov.cdsco.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {
    List<NotificationEntity> findByRecipientUserIdOrderByCreatedAtDesc(UUID recipientUserId);
    List<NotificationEntity> findByRecipientUserIdAndReadFalseOrderByCreatedAtDesc(UUID recipientUserId);
    long countByRecipientUserIdAndReadFalse(UUID recipientUserId);
}
