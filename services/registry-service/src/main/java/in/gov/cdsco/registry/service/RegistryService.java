package in.gov.cdsco.registry.service;

import in.gov.cdsco.registry.domain.entity.DrugProduct;
import in.gov.cdsco.registry.repository.DrugProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RegistryService {

    @Autowired
    private DrugProductRepository drugRepo;

    @Transactional
    public DrugProduct registerDrug(DrugProduct product) {
        product.setRegistryId("DRUG-" + System.currentTimeMillis());
        return drugRepo.save(product);
    }

    public List<DrugProduct> searchDrugs(String query) {
        if (query == null || query.isBlank()) {
            return drugRepo.findAll();
        }
        return drugRepo.findByBrandNameContainingIgnoreCaseOrGenericNameContainingIgnoreCase(query, query);
    }
}
