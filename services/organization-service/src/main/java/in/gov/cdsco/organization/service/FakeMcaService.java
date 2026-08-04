package in.gov.cdsco.organization.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FakeMcaService {
    private static final Logger log = LoggerFactory.getLogger(FakeMcaService.class);

    public Map<String, String> verifyCompany(String cin) {
        log.info("[FAKE MCA API] Verifying CIN: {}", cin);
        // In demo mode, we just return a mocked company response for any CIN
        return Map.of(
            "cin", cin,
            "companyName", "Demo Pharmaceuticals Ltd.",
            "status", "Active",
            "dateOfIncorporation", "15-08-2010"
        );
    }
}
