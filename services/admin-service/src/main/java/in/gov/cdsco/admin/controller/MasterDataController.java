package in.gov.cdsco.admin.controller;

import in.gov.cdsco.admin.entity.MasterDataEntity;
import in.gov.cdsco.admin.repository.MasterDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/master-data")
@RequiredArgsConstructor
public class MasterDataController {

    private final MasterDataRepository masterDataRepository;

    @GetMapping
    public ResponseEntity<List<MasterDataEntity>> getAllMasterData() {
        return ResponseEntity.ok(masterDataRepository.findAllByOrderByCategoryAscCodeAsc());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MasterDataEntity>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(masterDataRepository.findByCategoryAndIsActiveTrue(category));
    }

    @PostMapping
    public ResponseEntity<MasterDataEntity> createMasterData(@RequestBody MasterDataEntity entity) {
        return ResponseEntity.ok(masterDataRepository.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MasterDataEntity> updateMasterData(@PathVariable java.util.UUID id, @RequestBody MasterDataEntity entityDetails) {
        return masterDataRepository.findById(id).map(entity -> {
            entity.setCategory(entityDetails.getCategory());
            entity.setCode(entityDetails.getCode());
            entity.setName(entityDetails.getName());
            entity.setDescription(entityDetails.getDescription());
            entity.setIsActive(entityDetails.getIsActive());
            return ResponseEntity.ok(masterDataRepository.save(entity));
        }).orElse(ResponseEntity.notFound().build());
    }
}
