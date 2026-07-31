package in.gov.cdsco.licence.controller;

import in.gov.cdsco.licence.domain.entity.LicenceApplication;
import in.gov.cdsco.licence.service.LicenceApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
public class LicenceApplicationController {

    @Autowired
    private LicenceApplicationService service;

    @GetMapping
    public ResponseEntity<List<LicenceApplication>> getAllApplications(
            @RequestParam(required = false) UUID organizationId,
            @RequestParam(required = false) String status) {
            
        if (organizationId != null) {
            return ResponseEntity.ok(service.getApplicationsByOrganizationId(organizationId));
        } else if (status != null && status.equals("SUBMITTED")) {
            return ResponseEntity.ok(service.getPendingApplications());
        }
        return ResponseEntity.ok(service.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LicenceApplication> getApplication(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getApplicationById(id));
    }

    @PostMapping
    public ResponseEntity<LicenceApplication> createApplication(@RequestBody LicenceApplication app) {
        return ResponseEntity.ok(service.createApplication(app));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<LicenceApplication> submitApplication(@PathVariable UUID id) {
        return ResponseEntity.ok(service.submitApplication(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<LicenceApplication> approveApplication(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> payload) {
        String remarks = payload != null ? payload.getOrDefault("remarks", "") : "";
        return ResponseEntity.ok(service.updateApplicationStatus(id, "APPROVED", remarks));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<LicenceApplication> rejectApplication(@PathVariable UUID id, @RequestBody(required = false) Map<String, String> payload) {
        String remarks = payload != null ? payload.getOrDefault("remarks", "") : "";
        return ResponseEntity.ok(service.updateApplicationStatus(id, "REJECTED", remarks));
    }
}
