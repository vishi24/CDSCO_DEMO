package in.gov.cdsco.organization.controller;

import in.gov.cdsco.organization.domain.entity.Organization;
import in.gov.cdsco.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For demo simplicity
public class OrganizationController {

    private static final Logger log = LoggerFactory.getLogger(OrganizationController.class);

    private final OrganizationRepository repository;
    // RestTemplate for inter-service calls (identity-service)
    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/register")
    public ResponseEntity<Organization> register(@RequestBody Organization org) {
        org.setOrgCode("ORG-" + (10000 + (int)(Math.random() * 90000)));
        org.setStatus("PENDING_APPROVAL");

        // Generate DDRS User ID format
        String year = String.valueOf(java.time.Year.now().getValue());
        String ddrsUserId = "DDRS/" + year + "/" + String.format("%08d", (int)(Math.random() * 90000000) + 10000000);
        org.setDdrsUserId(ddrsUserId);

        Organization saved = repository.save(org);

        // Asynchronously create the user in identity-service so they can login immediately
        try {
            // Password may arrive as 'password' or 'passwordHash' from frontend
            String rawPassword = org.getPassword() != null ? org.getPassword()
                               : org.getPasswordHash() != null ? org.getPasswordHash()
                               : "password";

            Map<String, Object> userPayload = new java.util.HashMap<>();
            userPayload.put("email", saved.getEmail() != null ? saved.getEmail() : "");
            userPayload.put("mobile", saved.getMobile() != null ? saved.getMobile() : "");
            userPayload.put("fullName", org.getFullName() != null ? org.getFullName()
                         : saved.getContactPersonName() != null ? saved.getContactPersonName()
                         : saved.getOrgName() != null ? saved.getOrgName() : "");
            userPayload.put("password", rawPassword);
            userPayload.put("orgType", saved.getOrgType() != null ? saved.getOrgType() : "MANUFACTURER");
            userPayload.put("organizationId", saved.getId().toString());
            userPayload.put("contactPersonDesignation", saved.getContactPersonDesignation() != null ? saved.getContactPersonDesignation() : "");
            userPayload.put("ddrsUserId", ddrsUserId);
            if (org.getDateOfBirth() != null) userPayload.put("dateOfBirth", org.getDateOfBirth());
            if (org.getNationality() != null) userPayload.put("nationality", org.getNationality());
            if (org.getQualification() != null) userPayload.put("qualification", org.getQualification());
            if (org.getExperienceYears() != null) userPayload.put("experienceYears", org.getExperienceYears());
            if (org.getFatherSpouseName() != null) userPayload.put("fatherSpouseName", org.getFatherSpouseName());

            restTemplate.postForObject("http://identity-service:8081/api/v1/auth/register", userPayload, Map.class);
            log.info("[REGISTRATION] Created user in identity-service for email: {}", saved.getEmail());
        } catch (Exception e) {
            log.warn("[REGISTRATION] Could not create user in identity-service: {}. User may need to be created manually.", e.getMessage());
        }

        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrgs() {
        return ResponseEntity.ok(repository.findAll());
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<Organization>> getPendingOrgs() {
        return ResponseEntity.ok(repository.findByStatus("PENDING_APPROVAL"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrg(@PathVariable UUID id) {
        return repository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
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
