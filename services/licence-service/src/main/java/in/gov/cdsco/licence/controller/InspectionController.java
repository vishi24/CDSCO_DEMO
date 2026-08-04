package in.gov.cdsco.licence.controller;

import in.gov.cdsco.licence.domain.entity.InspectionEntity;
import in.gov.cdsco.licence.service.InspectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inspections")
public class InspectionController {

    @Autowired
    private InspectionService inspectionService;

    /**
     * POST /api/v1/inspections
     * Schedule or submit an inspection report for an application.
     */
    @PostMapping
    public ResponseEntity<InspectionEntity> createOrSubmitInspection(@RequestBody Map<String, Object> request) {
        UUID applicationId = UUID.fromString((String) request.get("applicationId"));
        String checklistJson    = (String) request.getOrDefault("checklistJson", null);
        String criticalObs      = (String) request.getOrDefault("criticalObservations", null);
        String severity         = (String) request.getOrDefault("observationSeverity", "MINOR");
        Double lat              = request.get("latitude") != null ? Double.parseDouble(request.get("latitude").toString()) : null;
        Double lng              = request.get("longitude") != null ? Double.parseDouble(request.get("longitude").toString()) : null;
        String reportUrl        = (String) request.getOrDefault("inspectionReportUrl", null);
        String photoUrlsJson    = (String) request.getOrDefault("photoUrlsJson", null);

        // If checklistJson present → full report submission, else create/schedule
        if (checklistJson != null) {
            InspectionEntity saved = inspectionService.submitReport(
                    applicationId, checklistJson, criticalObs, severity, lat, lng, reportUrl, photoUrlsJson);
            return ResponseEntity.ok(saved);
        } else {
            String inspectionType  = (String) request.getOrDefault("inspectionType", "ROUTINE");
            String inspectionDateStr = (String) request.getOrDefault("inspectionDate", LocalDate.now().plusDays(7).toString());
            String teamMembers     = (String) request.getOrDefault("teamMembers", "");
            UUID inspectorId = request.get("inspectorId") != null
                    ? UUID.fromString((String) request.get("inspectorId"))
                    : UUID.fromString("00000000-0000-0000-0000-000000000002");

            InspectionEntity saved = inspectionService.createInspection(
                    applicationId, inspectorId, inspectionType,
                    LocalDate.parse(inspectionDateStr), teamMembers);
            return ResponseEntity.ok(saved);
        }
    }

    /**
     * POST /api/v1/inspections/{applicationId}/decision
     * Issue a final decision (Approve/Reject/Defer) and generate RC licence number.
     */
    @PostMapping("/{applicationId}/decision")
    public ResponseEntity<InspectionEntity> issueDecision(
            @PathVariable UUID applicationId,
            @RequestBody Map<String, Object> request) {

        String decisionStatus       = (String) request.getOrDefault("decisionStatus", "APPROVED");
        String approvalConditions   = (String) request.getOrDefault("approvalConditions", null);
        String rejectionReasonCode  = (String) request.getOrDefault("rejectionReasonCode", null);
        String rejectionNarrative   = (String) request.getOrDefault("rejectionNarrative", null);
        String rcLicenseNumber      = (String) request.getOrDefault("rcLicenseNumber", null);
        Integer licenseValidity     = request.get("licenseValidity") != null
                ? Integer.parseInt(request.get("licenseValidity").toString()) : 3;
        String signingOfficerName   = (String) request.getOrDefault("signingOfficerName", "CDSCO Officer");

        InspectionEntity saved = inspectionService.issueDecision(
                applicationId, decisionStatus, approvalConditions,
                rejectionReasonCode, rejectionNarrative, rcLicenseNumber,
                licenseValidity, signingOfficerName);
        return ResponseEntity.ok(saved);
    }

    /**
     * GET /api/v1/inspections/{applicationId}
     * Get all inspections for an application.
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<List<InspectionEntity>> getByApplication(@PathVariable UUID applicationId) {
        return ResponseEntity.ok(inspectionService.getByApplicationId(applicationId));
    }
}
