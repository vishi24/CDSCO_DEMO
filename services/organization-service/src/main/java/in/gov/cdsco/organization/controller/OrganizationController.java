package in.gov.cdsco.organization.controller;

import in.gov.cdsco.organization.domain.entity.Organization;
import in.gov.cdsco.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For demo simplicity
public class OrganizationController {

    private final OrganizationRepository repository;

    @PostMapping("/register")
    public ResponseEntity<Organization> register(@RequestBody Organization org) {
        org.setOrgCode("ORG-" + (10000 + (int)(Math.random() * 90000)));
        org.setStatus("PENDING_APPROVAL");
        return ResponseEntity.ok(repository.save(org));
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrgs() {
        return ResponseEntity.ok(repository.findAll());
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Organization>> getPendingOrgs() {
        return ResponseEntity.ok(repository.findByStatus("PENDING_APPROVAL"));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Organization> approveOrg(@PathVariable UUID id) {
        return repository.findById(id).map(org -> {
            org.setStatus("APPROVED");
            return ResponseEntity.ok(repository.save(org));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Organization> rejectOrg(@PathVariable UUID id) {
        return repository.findById(id).map(org -> {
            org.setStatus("REJECTED");
            return ResponseEntity.ok(repository.save(org));
        }).orElse(ResponseEntity.notFound().build());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "An organization with this GST Number or Email is already registered."));
    }
}
