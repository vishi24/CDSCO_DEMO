package in.gov.cdsco.workflow.controller;

import in.gov.cdsco.workflow.domain.entity.WorkflowHistory;
import in.gov.cdsco.workflow.domain.entity.WorkflowInstance;
import in.gov.cdsco.workflow.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workflow")
public class WorkflowController {

    @Autowired
    private WorkflowService service;

    @PostMapping("/initiate")
    public ResponseEntity<WorkflowInstance> initiateWorkflow(@RequestBody Map<String, Object> payload) {
        UUID entityId = UUID.fromString((String) payload.get("entityId"));
        String entityType = (String) payload.get("entityType");
        String defId = (String) payload.get("workflowDefId");
        String stage = (String) payload.get("initialStage");
        
        return ResponseEntity.ok(service.initiateWorkflow(entityId, entityType, defId, stage));
    }

    @PostMapping("/transition")
    public ResponseEntity<WorkflowInstance> transitionWorkflow(@RequestBody Map<String, Object> payload) {
        UUID entityId = UUID.fromString((String) payload.get("entityId"));
        String entityType = (String) payload.get("entityType");
        String toStage = (String) payload.get("toStage");
        String action = (String) payload.get("action");
        String comments = (String) payload.get("comments");
        
        return ResponseEntity.ok(service.transition(entityId, entityType, toStage, action, null, comments));
    }

    @GetMapping("/{entityType}/{entityId}/history")
    public ResponseEntity<List<WorkflowHistory>> getHistory(@PathVariable String entityType, @PathVariable UUID entityId) {
        return ResponseEntity.ok(service.getHistory(entityId, entityType));
    }
}
