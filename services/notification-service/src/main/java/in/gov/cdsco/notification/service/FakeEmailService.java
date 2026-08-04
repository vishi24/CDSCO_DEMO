package in.gov.cdsco.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FakeEmailService {
    private static final Logger log = LoggerFactory.getLogger(FakeEmailService.class);

    public void sendEmail(String toAddress, String subject, String body) {
        log.info("\n------------------------------------------------------------\n" +
                 "[FAKE EMAIL] To: {}\n" +
                 "[FAKE EMAIL] Subject: {}\n" +
                 "[FAKE EMAIL] Body: {}\n" +
                 "------------------------------------------------------------", toAddress, subject, body);
    }
}
