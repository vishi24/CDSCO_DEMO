package in.gov.cdsco.organization.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FakeGstnService {
    private static final Logger log = LoggerFactory.getLogger(FakeGstnService.class);

    public Map<String, String> verifyGstn(String gstn) {
        log.info("[FAKE GSTN API] Verifying GSTN: {}", gstn);
        // In demo mode, we just return a mocked GSTN response
        return Map.of(
            "gstn", gstn,
            "legalName", "Demo Pharmaceuticals Ltd.",
            "status", "Active",
            "taxpayerType", "Regular"
        );
    }
}
