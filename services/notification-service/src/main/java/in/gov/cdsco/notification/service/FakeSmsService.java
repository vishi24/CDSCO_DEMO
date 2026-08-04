package in.gov.cdsco.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FakeSmsService {
    private static final Logger log = LoggerFactory.getLogger(FakeSmsService.class);

    public void sendSms(String mobile, String message) {
        log.info("\n------------------------------------------------------------\n" +
                 "[FAKE SMS] To: {}\n" +
                 "[FAKE SMS] Message: {}\n" +
                 "------------------------------------------------------------", mobile, message);
    }
}
