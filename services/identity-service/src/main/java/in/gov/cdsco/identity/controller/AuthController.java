package in.gov.cdsco.identity.controller;

import in.gov.cdsco.identity.dto.LoginRequest;
import in.gov.cdsco.identity.dto.LoginResponse;
import in.gov.cdsco.identity.entity.UserEntity;
import in.gov.cdsco.identity.repository.UserRepository;
import in.gov.cdsco.identity.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    @Value("${jwt.expiration}")
    private long expiration;

    @GetMapping("/me")
    public ResponseEntity<UserEntity> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Dummy mock: get admin user for demo
        return ResponseEntity.ok(userRepository.findByEmail("admin@cdsco.gov.in").orElse(null));
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email");
        }
        
        boolean isPasswordMatch = passwordEncoder.matches(request.getPassword(), user.getPasswordHash()) 
            || request.getPassword().equals(user.getPasswordHash())
            || request.getPassword().equals("password"); // Demo backdoor

        if (!isPasswordMatch) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }

        if (!user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account is inactive");
        }

        String token = jwtService.generateToken(user);
        
        LoginResponse response = LoginResponse.builder()
                .access_token(token)
                .token_type("Bearer")
                .expires_in(expiration / 1000)
                .build();
                
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validate() {
        // Validation is done via Nginx + Spring Security Filter in API Gateway or directly here
        // If the request reaches here, it means the JWT filter (if any) let it pass.
        // For our mock, we just return 200 OK. Actual token validation happens in microservices.
        return ResponseEntity.ok().build();
    }
}
