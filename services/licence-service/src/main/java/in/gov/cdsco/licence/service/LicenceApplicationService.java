package in.gov.cdsco.licence.service;

import in.gov.cdsco.licence.domain.entity.LicenceApplication;
import in.gov.cdsco.licence.repository.LicenceApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class LicenceApplicationService {

    @Autowired
    private LicenceApplicationRepository repository;

    public List<LicenceApplication> getAllApplications() {
        return repository.findAll();
    }

    public List<LicenceApplication> getApplicationsByOrganizationId(UUID orgId) {
        return repository.findByOrganizationId(orgId);
    }
    
    public List<LicenceApplication> getPendingApplications() {
        return repository.findByCurrentStatus("SUBMITTED");
    }

    public LicenceApplication getApplicationById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Transactional
    public LicenceApplication createApplication(LicenceApplication application) {
        // Generate a mock application number
        application.setApplicationNumber("APP-" + System.currentTimeMillis());
        application.setCurrentStatus("DRAFT");
        return repository.save(application);
    }

    @Transactional
    public LicenceApplication submitApplication(UUID id) {
        LicenceApplication app = getApplicationById(id);
        app.setCurrentStatus("SUBMITTED");
        app.setSubmittedAt(ZonedDateTime.now());
        // TODO: Publish event for Workflow engine
        return repository.save(app);
    }
    
    @Transactional
    public LicenceApplication updateApplicationStatus(UUID id, String status, String remarks) {
        LicenceApplication app = getApplicationById(id);
        app.setCurrentStatus(status);
        app.setRemarks(remarks);
        if ("APPROVED".equals(status)) {
            app.setApprovedAt(ZonedDateTime.now());
            app.setExpiryDate(ZonedDateTime.now().plusYears(5).toLocalDate()); // Mock expiry
        }
        return repository.save(app);
    }
}
