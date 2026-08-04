package in.gov.cdsco.workflow.service;

import in.gov.cdsco.workflow.domain.entity.WorkflowHistory;
import in.gov.cdsco.workflow.domain.entity.WorkflowInstance;
import in.gov.cdsco.workflow.repository.WorkflowHistoryRepository;
import in.gov.cdsco.workflow.repository.WorkflowInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowInstanceRepository instanceRepository;

    @Autowired
    private WorkflowHistoryRepository historyRepository;

    @Transactional
    public WorkflowInstance initiateWorkflow(UUID entityId, String entityType, String workflowDefId, String initialStage) {
        WorkflowInstance instance = new WorkflowInstance();
        instance.setEntityId(entityId);
        instance.setEntityType(entityType);
        instance.setWorkflowDefinitionId(workflowDefId);
        instance.setCurrentStage(initialStage);
        instance = instanceRepository.save(instance);

        recordHistory(instance.getId(), null, initialStage, "INITIATE", null, "Workflow initiated");
        return instance;
    }

    @Transactional
    public WorkflowInstance transition(UUID entityId, String entityType, String toStage, String action, UUID actionBy, String comments) {
        WorkflowInstance instance = instanceRepository.findByEntityIdAndEntityType(entityId, entityType)
                .orElseThrow(() -> new RuntimeException("Workflow instance not found for entity"));

        String fromStage = instance.getCurrentStage();
        
        // --- Enforce State Machine for Licence Applications ---
        if ("LICENCE_APPLICATION".equals(entityType)) {
            boolean valid = false;
            if ("DRAFT".equals(fromStage) && "SUBMITTED".equals(toStage)) valid = true;
            else if ("SUBMITTED".equals(fromStage) && "SCRUTINY".equals(toStage)) valid = true;
            else if ("SCRUTINY".equals(fromStage) && "INSPECTION_SCHEDULED".equals(toStage)) valid = true;
            else if ("INSPECTION_SCHEDULED".equals(fromStage) && "INSPECTION_COMPLETED".equals(toStage)) valid = true;
            else if (("SCRUTINY".equals(fromStage) || "INSPECTION_COMPLETED".equals(fromStage)) && 
                     ("APPROVED".equals(toStage) || "REJECTED".equals(toStage) || "QUERY_RAISED".equals(toStage))) valid = true;
            else if ("QUERY_RAISED".equals(fromStage) && "SCRUTINY".equals(toStage)) valid = true;
            
            if (!valid) {
                throw new IllegalStateException("Invalid workflow transition from " + fromStage + " to " + toStage);
            }
        }
        // --------------------------------------------------------

        instance.setPreviousStage(fromStage);
        instance.setCurrentStage(toStage);
        instance = instanceRepository.save(instance);

        recordHistory(instance.getId(), fromStage, toStage, action, actionBy, comments);
        
        // TODO: Publish Spring ApplicationEvent for other services
        return instance;
    }

    private void recordHistory(UUID instanceId, String from, String to, String action, UUID actionBy, String comments) {
        WorkflowHistory history = new WorkflowHistory();
        history.setWorkflowInstanceId(instanceId);
        history.setFromStage(from);
        history.setToStage(to);
        history.setAction(action);
        history.setActionBy(actionBy);
        history.setComments(comments);
        historyRepository.save(history);
    }
    
    public List<WorkflowHistory> getHistory(UUID entityId, String entityType) {
        WorkflowInstance instance = instanceRepository.findByEntityIdAndEntityType(entityId, entityType)
                .orElseThrow(() -> new RuntimeException("Workflow instance not found for entity"));
        return historyRepository.findByWorkflowInstanceIdOrderByActionAtDesc(instance.getId());
    }
}
