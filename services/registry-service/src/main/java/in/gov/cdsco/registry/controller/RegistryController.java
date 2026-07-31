package in.gov.cdsco.registry.controller;

import in.gov.cdsco.registry.domain.entity.DrugProduct;
import in.gov.cdsco.registry.service.RegistryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/registry")
public class RegistryController {

    @Autowired
    private RegistryService service;

    @PostMapping("/drugs")
    public ResponseEntity<DrugProduct> registerDrug(@RequestBody DrugProduct product) {
        return ResponseEntity.ok(service.registerDrug(product));
    }

    @GetMapping("/drugs")
    public ResponseEntity<List<DrugProduct>> searchDrugs(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(service.searchDrugs(q));
    }
}
