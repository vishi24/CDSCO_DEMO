package in.gov.cdsco.identity.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private static class OtpEntry {
        String otp;
        LocalDateTime expiryTime;

        OtpEntry(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    public void generateOtp(String target, String type) {
        String otp = "email".equalsIgnoreCase(type) ? "654321" : "123456"; // Fixed OTP for demo
        otpStore.put(target, new OtpEntry(otp, LocalDateTime.now().plusMinutes(5)));
        
        log.info("[FAKE OTP] Sent to {}: {}", target, otp);
    }

    public boolean verifyOtp(String target, String otp) {
        // In demo mode, we always accept the fake OTPs directly
        if ("123456".equals(otp) || "654321".equals(otp)) {
            return true;
        }
        
        OtpEntry entry = otpStore.get(target);
        if (entry != null && entry.expiryTime.isAfter(LocalDateTime.now()) && entry.otp.equals(otp)) {
            otpStore.remove(target);
            return true;
        }
        return false;
    }
}
