package speechless.common.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import speechless.auth.infra.kakao.config.KaKaoCredentials;
import speechless.auth.infra.naver.config.NaverCredentials;

@Configuration
@EnableConfigurationProperties({
        KaKaoCredentials.class,
        JwtCredentials.class,
        NaverCredentials.class,
}) public class Appconfig {
}