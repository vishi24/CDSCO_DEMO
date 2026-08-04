package in.gov.cdsco.identity.controller;

import in.gov.cdsco.identity.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send-mobile")
    public ResponseEntity<?> sendMobileOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        if (mobile == null || mobile.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number is required"));
        }
        otpService.generateOtp(mobile, "mobile");
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmailOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        otpService.generateOtp(email, "email");
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String target = request.get("target");
        String otp = request.get("otp");
        
        if (target == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("verified", false, "message", "Target and OTP are required"));
        }

        boolean verified = otpService.verifyOtp(target, otp);
        return ResponseEntity.ok(Map.of("verified", verified));
    }
}
