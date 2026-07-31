package in.gov.cdsco.identity.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import in.gov.cdsco.identity.entity.UserEntity;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.issuer}")
    private String issuer;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
        
        // Keycloak compatible claims structure
        claims.put("preferred_username", user.getEmail());
        claims.put("email", user.getEmail());
        
        Map<String, Object> realmAccess = new HashMap<>();
        realmAccess.put("roles", List.of(user.getRole()));
        claims.put("realm_access", realmAccess);
        
        if (user.getOrganizationId() != null) {
            claims.put("organization_id", user.getOrganizationId().toString());
        }

        return Jwts.builder()
                .claims(claims)
                .subject(user.getKeycloakUserId())
                .issuer(issuer)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .id(java.util.UUID.randomUUID().toString())
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }
}
