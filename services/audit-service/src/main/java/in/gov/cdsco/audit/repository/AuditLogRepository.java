package in.gov.cdsco.audit.repository;

import in.gov.cdsco.audit.entity.AuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLogEntity, UUID> {
    List<AuditLogEntity> findAllByOrderByPerformedAtDesc();
    List<AuditLogEntity> findByEntityTypeOrderByPerformedAtDesc(String entityType);
    List<AuditLogEntity> findByPerformedByOrderByPerformedAtDesc(UUID performedBy);
}
