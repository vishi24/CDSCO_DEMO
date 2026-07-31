package in.gov.cdsco.workflow.repository;

import in.gov.cdsco.workflow.domain.entity.WorkflowInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkflowInstanceRepository extends JpaRepository<WorkflowInstance, UUID> {
    Optional<WorkflowInstance> findByEntityIdAndEntityType(UUID entityId, String entityType);
    List<WorkflowInstance> findByAssignedTo(UUID assignedTo);
}
