package speechless.auth.infra.naver;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import speechless.auth.domain.OAuthTokenClient;
import speechless.auth.exception.TokenMissingException;
import speechless.auth.infra.naver.config.NaverCredentials;
import speechless.auth.infra.naver.dto.NaverTokenResponse;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import static java.util.Objects.requireNonNull;
import static org.springframework.http.HttpMethod.GET;

@Component
@RequiredArgsConstructor
public class NaverOAuthTokenClient implements OAuthTokenClient {

    private static final String ACCESS_TOKEN_URI = "https://nid.naver.com/oauth2.0/token";
    private static final String GRANT_TYPE = "authorization_code";
    private final RestTemplate restTemplate;
    private final String State = "deer4";
    private final NaverCredentials naverCredentials;
    private SecureRandom random = new SecureRandom();

    @Override
    public String getAccessToken(String authCode, String redirectUri) {
        Map<String, String> params = createRequestBodyWithAuthcode(authCode, redirectUri);
        HttpEntity<?> request = new HttpEntity<>(new HttpHeaders());
        ResponseEntity<NaverTokenResponse> naverTokenResponseResponse = getNaverToken(request, params);
        return requireNonNull(requireNonNull(naverTokenResponseResponse.getBody())).accessToken();
    }

    private Map<String, String> createRequestBodyWithAuthcode(String authCode, String redirectUri) {
        Map<String, String> params = new HashMap<>();
        params.put("grant_type", GRANT_TYPE);
        params.put("client_id", naverCredentials.getClientId());
        params.put("client_secret", naverCredentials.getClientSecret());
        params.put("code", authCode);
        params.put("state", State);
        return params;
    }

    public String generateState(){
        return new BigInteger(130, random).toString();
    }

    private ResponseEntity<NaverTokenResponse> getNaverToken(HttpEntity<?> request, Map<String, String> params) {
        try {
            return restTemplate.exchange(
                    ACCESS_TOKEN_URI,
                    GET,
                    request,
                    NaverTokenResponse.class,
                    params
            );
        } catch (HttpClientErrorException e) {
            throw new TokenMissingException();
        }
    }
}
