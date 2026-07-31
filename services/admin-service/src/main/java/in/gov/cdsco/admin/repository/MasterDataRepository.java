package in.gov.cdsco.admin.repository;

import in.gov.cdsco.admin.entity.MasterDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MasterDataRepository extends JpaRepository<MasterDataEntity, UUID> {
    List<MasterDataEntity> findByCategoryAndIsActiveTrue(String category);
    List<MasterDataEntity> findAllByOrderByCategoryAscCodeAsc();
}
