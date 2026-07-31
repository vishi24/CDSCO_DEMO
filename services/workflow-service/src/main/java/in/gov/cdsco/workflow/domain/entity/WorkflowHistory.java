package in.gov.cdsco.workflow.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "workflow_history")
public class WorkflowHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "workflow_instance_id", nullable = false)
    private UUID workflowInstanceId;

    @Column(name = "from_stage")
    private String fromStage;

    @Column(name = "to_stage")
    private String toStage;

    @Column(name = "action")
    private String action;

    @Column(name = "action_by")
    private UUID actionBy;

    @Column(name = "action_at", updatable = false)
    private ZonedDateTime actionAt;

    @Column(name = "comments")
    private String comments;

    @Column(name = "attachments_json")
    private String attachmentsJson;

    @PrePersist
    protected void onCreate() {
        this.actionAt = ZonedDateTime.now();
    }
}
