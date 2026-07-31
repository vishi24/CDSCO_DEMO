package in.gov.cdsco.audit.controller;

import in.gov.cdsco.audit.entity.AuditLogEntity;
import in.gov.cdsco.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    public ResponseEntity<List<AuditLogEntity>> getAllAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByPerformedAtDesc());
    }
    
    @GetMapping("/entity/{entityType}")
    public ResponseEntity<List<AuditLogEntity>> getByEntityType(@PathVariable String entityType) {
        return ResponseEntity.ok(auditLogRepository.findByEntityTypeOrderByPerformedAtDesc(entityType));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogEntity>> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(auditLogRepository.findByPerformedByOrderByPerformedAtDesc(userId));
    }

    @PostMapping
    public ResponseEntity<AuditLogEntity> logAction(@RequestBody AuditLogEntity logRequest) {
        return ResponseEntity.ok(auditLogRepository.save(logRequest));
    }
}
