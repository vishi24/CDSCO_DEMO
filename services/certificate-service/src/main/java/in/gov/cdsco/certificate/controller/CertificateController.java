package in.gov.cdsco.certificate.controller;

import in.gov.cdsco.certificate.domain.entity.Certificate;
import in.gov.cdsco.certificate.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/certificates")
public class CertificateController {

    @Autowired
    private CertificateService service;

    @PostMapping("/generate")
    public ResponseEntity<Certificate> generateCertificate(@RequestBody Map<String, Object> payload) {
        UUID orgId = UUID.fromString((String) payload.get("organizationId"));
        UUID appId = payload.get("applicationId") != null ? UUID.fromString((String) payload.get("applicationId")) : null;
        String type = (String) payload.get("certificateType");
        UUID officerId = payload.get("officerId") != null ? UUID.fromString((String) payload.get("officerId")) : null;
        
        return ResponseEntity.ok(service.generateCertificate(orgId, appId, type, officerId));
    }

    @GetMapping
    public ResponseEntity<List<Certificate>> getCertificates(@RequestParam UUID organizationId) {
        return ResponseEntity.ok(service.getCertificatesByOrg(organizationId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certificate> getCertificate(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getCertificateById(id));
    }

    @GetMapping("/verify/{certNumber}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String certNumber) {
        return ResponseEntity.ok(service.verifyCertificate(certNumber));
    }
}
