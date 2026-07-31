package in.gov.cdsco.workflow.repository;

import in.gov.cdsco.workflow.domain.entity.WorkflowHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, UUID> {
    List<WorkflowHistory> findByWorkflowInstanceIdOrderByActionAtDesc(UUID workflowInstanceId);
}
