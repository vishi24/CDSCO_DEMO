package in.gov.cdsco.registry.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "drug_products")
public class DrugProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "registry_id", unique = true)
    private String registryId;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "generic_name")
    private String genericName;

    @Column(name = "drug_category")
    private String drugCategory;

    @Column(name = "dosage_form")
    private String dosageForm;

    @Column(name = "route_of_administration")
    private String routeOfAdministration;

    @Column(name = "strength")
    private String strength;

    @Column(name = "manufacturer_id")
    private UUID manufacturerId;

    @Column(name = "status")
    private String status = "REGISTERED";

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = ZonedDateTime.now();
        if (this.registrationDate == null) {
            this.registrationDate = LocalDate.now();
        }
    }
}
