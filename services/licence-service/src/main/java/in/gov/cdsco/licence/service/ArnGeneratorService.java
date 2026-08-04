package in.gov.cdsco.licence.service;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ArnGeneratorService {

    // In a real app this would be backed by a DB sequence
    private final AtomicInteger sequence = new AtomicInteger(1000);

    /**
     * Generates ARN in format: ARN/CDSCO/YYYY/XXXXXXXX (8-digit zero-padded)
     * as specified in the DDRS FRS.
     */
    public String generateArn() {
        String year = String.valueOf(LocalDate.now().getYear());
        int nextVal = sequence.incrementAndGet();
        return String.format("ARN/CDSCO/%s/%08d", year, nextVal);
    }

    /**
     * Generates RC licence number in format: RC/CDSCO/YYYY/XXXXXXXX
     */
    public String generateRcNumber() {
        String year = String.valueOf(LocalDate.now().getYear());
        int nextVal = sequence.incrementAndGet();
        return String.format("RC/CDSCO/%s/%08d", year, nextVal);
    }
}
