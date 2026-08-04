package in.gov.cdsco.licence.service;

import in.gov.cdsco.licence.domain.entity.InspectionEntity;
import in.gov.cdsco.licence.repository.InspectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class InspectionService {

    @Autowired
    private InspectionRepository inspectionRepository;

    @Transactional
    public InspectionEntity createInspection(UUID applicationId, UUID inspectorId,
                                             String inspectionType, LocalDate inspectionDate,
                                             String teamMembers) {
        InspectionEntity inspection = new InspectionEntity();
        inspection.setApplicationId(applicationId);
        inspection.setInspectorId(inspectorId);
        inspection.setInspectionType(inspectionType);
        inspection.setInspectionDate(inspectionDate);
        inspection.setTeamMembers(teamMembers);
        inspection.setStatus("SCHEDULED");
        return inspectionRepository.save(inspection);
    }

    @Transactional
    public InspectionEntity submitReport(UUID applicationId, String checklistJson,
                                         String criticalObservations, String observationSeverity,
                                         Double gpsLat, Double gpsLng,
                                         String inspectionReportUrl, String photoUrlsJson) {
        InspectionEntity inspection = inspectionRepository.findByApplicationId(applicationId)
                .orElse(new InspectionEntity());
        inspection.setApplicationId(applicationId);
        inspection.setChecklistJson(checklistJson);
        inspection.setCriticalObservations(criticalObservations);
        inspection.setObservationSeverity(observationSeverity);
        inspection.setGpsLatitude(gpsLat);
        inspection.setGpsLongitude(gpsLng);
        inspection.setInspectionReportUrl(inspectionReportUrl);
        inspection.setPhotoUrlsJson(photoUrlsJson);
        inspection.setStatus("COMPLETED");
        return inspectionRepository.save(inspection);
    }

    @Transactional
    public InspectionEntity issueDecision(UUID applicationId, String decisionStatus,
                                           String approvalConditions, String rejectionReasonCode,
                                           String rejectionNarrative, String rcLicenseNumber,
                                           Integer licenseValidityYears, String signingOfficerName) {
        InspectionEntity inspection = inspectionRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("No inspection found for application: " + applicationId));
        inspection.setDecisionStatus(decisionStatus);
        inspection.setApprovalConditions(approvalConditions);
        inspection.setRejectionReasonCode(rejectionReasonCode);
        inspection.setRejectionNarrative(rejectionNarrative);
        inspection.setRcLicenseNumber(rcLicenseNumber);
        inspection.setLicenseValidityYears(licenseValidityYears);
        if (rcLicenseNumber != null) {
            inspection.setLicenseIssueDate(LocalDate.now());
            inspection.setLicenseExpiryDate(LocalDate.now().plusYears(licenseValidityYears != null ? licenseValidityYears : 3));
        }
        inspection.setOfficerSigned(true);
        inspection.setSigningOfficerName(signingOfficerName);
        inspection.setSignedAt(ZonedDateTime.now());
        return inspectionRepository.save(inspection);
    }

    public List<InspectionEntity> getByApplicationId(UUID applicationId) {
        return inspectionRepository.findAllByApplicationId(applicationId);
    }
}
