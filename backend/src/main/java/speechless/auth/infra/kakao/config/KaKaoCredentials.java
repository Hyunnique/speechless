package speechless.auth.infra.kakao.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@RequiredArgsConstructor
@ConfigurationProperties(prefix = "oauth.kakao")
public class KaKaoCredentials {
    private final String clientId;
    private final String redirectUri;
    private final String clientSecret;
}
