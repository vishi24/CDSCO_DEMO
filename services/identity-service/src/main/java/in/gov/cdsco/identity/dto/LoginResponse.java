package in.gov.cdsco.identity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String access_token;
    private String token_type;
    private long expires_in;
}
