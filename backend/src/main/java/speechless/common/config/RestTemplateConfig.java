package speechless.common.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {
    private static final int TIMEOUT_SECOUNDS = 2;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder restTemplateBuilder) {
        return restTemplateBuilder.setConnectTimeout(Duration.ofSeconds(TIMEOUT_SECOUNDS)).setReadTimeout(Duration.ofSeconds(TIMEOUT_SECOUNDS)).build();
    }
}
