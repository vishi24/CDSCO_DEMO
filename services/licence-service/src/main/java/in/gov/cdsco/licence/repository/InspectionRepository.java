package in.gov.cdsco.licence.repository;

import in.gov.cdsco.licence.domain.entity.InspectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InspectionRepository extends JpaRepository<InspectionEntity, UUID> {
    Optional<InspectionEntity> findByApplicationId(UUID applicationId);
    List<InspectionEntity> findAllByApplicationId(UUID applicationId);
}
