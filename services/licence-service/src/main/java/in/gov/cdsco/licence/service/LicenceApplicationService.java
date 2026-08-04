package in.gov.cdsco.licence.service;

import in.gov.cdsco.licence.domain.entity.LicenceApplication;
import in.gov.cdsco.licence.repository.LicenceApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class LicenceApplicationService {

    private static final Logger log = LoggerFactory.getLogger(LicenceApplicationService.class);

    @Autowired
    private LicenceApplicationRepository repository;

    @Autowired
    private ArnGeneratorService arnGeneratorService;

    @Autowired
    private FeeCalculationService feeCalculationService;

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
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found: " + id));
    }

    @Transactional
    public LicenceApplication createApplication(LicenceApplication application) {
        // Generate unique application number on create
        application.setApplicationNumber("APP-" + System.currentTimeMillis());
        application.setCurrentStatus("DRAFT");

        // Auto-calculate fee if not already set
        if (application.getApplicationFee() == null && application.getDrugClass() != null) {
            BigDecimal fee = feeCalculationService.calculateFee(
                    application.getDrugClass(),
                    application.getCaseType() != null ? application.getCaseType() : "FRESH"
            );
            application.setApplicationFee(fee);
        }

        LicenceApplication saved = repository.save(application);

        // If payment completed + DSC signed → auto-submit and generate ARN
        boolean paymentDone = Boolean.TRUE.equals(application.getFeePaid())
                || (application.getPaymentReference() != null && !application.getPaymentReference().isBlank());
        boolean dscDone = application.getApplicantDscToken() != null
                && !application.getApplicantDscToken().isBlank();

        if (paymentDone && dscDone) {
            return submitApplication(saved.getId());
        }
        return saved;
    }

    @Transactional
    public LicenceApplication submitApplication(UUID id) {
        LicenceApplication app = getApplicationById(id);

        // Generate ARN on first submission
        if (app.getArnNumber() == null) {
            String arn = arnGeneratorService.generateArn();
            app.setArnNumber(arn);
            log.info("[ARN GENERATED] Application {} → ARN: {}", app.getApplicationNumber(), arn);
        }

        app.setCurrentStatus("SUBMITTED");
        app.setSubmittedAt(ZonedDateTime.now());

        LicenceApplication saved = repository.save(app);

        // Fake notification log
        log.info("[FAKE SMS] Application {} submitted. ARN: {}", app.getApplicationNumber(), app.getArnNumber());
        log.info("[FAKE EMAIL] Application {} submitted. ARN: {}", app.getApplicationNumber(), app.getArnNumber());

        return saved;
    }

    @Transactional
    public LicenceApplication updateApplicationStatus(UUID id, String status, String remarks) {
        LicenceApplication app = getApplicationById(id);
        app.setCurrentStatus(status);
        app.setRemarks(remarks);

        if ("APPROVED".equals(status)) {
            app.setApprovedAt(ZonedDateTime.now());
            // Generate RC number if not already present
            if (app.getArnNumber() != null) {
                log.info("[FAKE SMS] Application {} APPROVED. RC issued.", app.getArnNumber());
                log.info("[FAKE EMAIL] Application {} APPROVED. RC issued.", app.getArnNumber());
            }
        } else if ("REJECTED".equals(status)) {
            log.info("[FAKE SMS] Application {} REJECTED. Reason: {}", app.getArnNumber(), remarks);
            log.info("[FAKE EMAIL] Application {} REJECTED. Reason: {}", app.getArnNumber(), remarks);
        } else if ("QUERY_RAISED".equals(status)) {
            log.info("[FAKE SMS] Deficiency raised on application {}. Please respond.", app.getArnNumber());
            log.info("[FAKE EMAIL] Deficiency raised on application {}. Please respond.", app.getArnNumber());
        } else if ("INSPECTION_SCHEDULED".equals(status)) {
            log.info("[FAKE SMS] Inspection scheduled for application {}.", app.getArnNumber());
            log.info("[FAKE EMAIL] Inspection scheduled for application {}.", app.getArnNumber());
        }

        return repository.save(app);
    }

    @Transactional
    public LicenceApplication patchApplication(UUID id, java.util.Map<String, Object> updates) {
        LicenceApplication app = getApplicationById(id);
        if (updates.containsKey("assignedOfficerName")) {
            app.setAssignedOfficerName((String) updates.get("assignedOfficerName"));
            app.setAssignmentDate(ZonedDateTime.now());
        }
        if (updates.containsKey("scrutinyStatus")) {
            app.setScrutinyStatus((String) updates.get("scrutinyStatus"));
        }
        if (updates.containsKey("deficiencyRemarks")) {
            app.setDeficiencyRemarks((String) updates.get("deficiencyRemarks"));
        }
        return repository.save(app);
    }
}
