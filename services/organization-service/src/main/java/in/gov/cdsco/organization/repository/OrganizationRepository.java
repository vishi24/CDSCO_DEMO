package in.gov.cdsco.organization.repository;

import in.gov.cdsco.organization.domain.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    List<Organization> findByStatus(String status);
}
