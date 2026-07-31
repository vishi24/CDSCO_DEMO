package in.gov.cdsco.certificate.service;

import in.gov.cdsco.certificate.domain.entity.Certificate;
import in.gov.cdsco.certificate.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository repository;

    @Transactional
    public Certificate generateCertificate(UUID orgId, UUID appId, String type, UUID officerId) {
        Certificate cert = new Certificate();
        cert.setCertificateNumber("CDSCO-" + System.currentTimeMillis());
        cert.setApplicationId(appId);
        cert.setOrganizationId(orgId);
        cert.setCertificateType(type);
        cert.setIssuedByOfficerId(officerId);
        cert.setIssueDate(LocalDate.now());
        cert.setExpiryDate(LocalDate.now().plusYears(5));
        
        // Mock generation data
        cert.setQrCodeData("https://cdsco.gov.in/verify/" + cert.getCertificateNumber());
        cert.setDigitalSignature("MOCK_BASE64_SIGNATURE_DATA_FOR_DEMO");
        cert.setPdfMinioKey("certificates/" + cert.getCertificateNumber() + ".pdf");
        
        return repository.save(cert);
    }

    public List<Certificate> getCertificatesByOrg(UUID orgId) {
        return repository.findByOrganizationId(orgId);
    }

    public Certificate getCertificateById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }
    
    public Certificate verifyCertificate(String certNumber) {
        return repository.findByCertificateNumber(certNumber)
                .orElseThrow(() -> new RuntimeException("Invalid certificate"));
    }
}
