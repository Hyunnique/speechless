package speechless.auth.domain;

public interface OAuthTokenClient {
    String getAccessToken(String authCode, String redirectUri);
}
