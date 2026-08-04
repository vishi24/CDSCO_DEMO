package in.gov.cdsco.licence.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Map;

@Service
public class FeeCalculationService {

    /**
     * Fee matrix per DDRS FRS Section — Application Fee Schedule
     * Keys: drug category → case type → fee in INR
     *
     * NEW_DRUG:        Fresh=5,00,000  | Endorsement=1,50,000 | Re-registration=2,00,000
     * FDC:             Fresh=3,00,000  | Endorsement=1,00,000 | Re-registration=1,50,000
     * BIOLOGICAL:      Fresh=10,00,000 | Endorsement=3,00,000 | Re-registration=5,00,000
     * GENERIC:         Fresh=75,000    | Endorsement=25,000   | Re-registration=40,000
     * MEDICAL_DEVICE:  Fresh=50,000    | Endorsement=25,000   | Re-registration=40,000
     * COSMETIC:        Fresh=10,000    | Endorsement=5,000    | Re-registration=8,000
     */
    private static final Map<String, Map<String, Long>> FEE_MATRIX = Map.of(
        "NEW_DRUG",      Map.of("FRESH", 500000L, "ENDORSEMENT", 150000L, "RE_REGISTRATION", 200000L),
        "FDC",           Map.of("FRESH", 300000L, "ENDORSEMENT", 100000L, "RE_REGISTRATION", 150000L),
        "BIOLOGICAL",    Map.of("FRESH", 1000000L, "ENDORSEMENT", 300000L, "RE_REGISTRATION", 500000L),
        "GENERIC",       Map.of("FRESH", 75000L, "ENDORSEMENT", 25000L, "RE_REGISTRATION", 40000L),
        "MEDICAL_DEVICE",Map.of("FRESH", 50000L, "ENDORSEMENT", 25000L, "RE_REGISTRATION", 40000L),
        "COSMETIC",      Map.of("FRESH", 10000L, "ENDORSEMENT", 5000L, "RE_REGISTRATION", 8000L)
    );

    public BigDecimal calculateFee(String drugCategory, String caseType) {
        if (drugCategory == null || caseType == null) return BigDecimal.valueOf(75000);
        Map<String, Long> caseMap = FEE_MATRIX.getOrDefault(drugCategory.toUpperCase(), null);
        if (caseMap == null) return BigDecimal.valueOf(75000);
        Long fee = caseMap.getOrDefault(caseType.toUpperCase(), 75000L);
        return BigDecimal.valueOf(fee);
    }
}
