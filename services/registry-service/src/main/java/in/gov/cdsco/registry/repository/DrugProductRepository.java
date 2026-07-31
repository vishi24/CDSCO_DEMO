package in.gov.cdsco.registry.repository;

import in.gov.cdsco.registry.domain.entity.DrugProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DrugProductRepository extends JpaRepository<DrugProduct, UUID> {
    List<DrugProduct> findByBrandNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(String brand, String generic);
}
