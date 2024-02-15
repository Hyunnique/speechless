package speechless.session.speechToText.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import speechless.session.speechToText.dto.SttRequest;
import speechless.session.speechToText.dto.SttResponse;
import speechless.session.speechToText.exception.SttException;

@Component
public class SttUtil {

    private static String invokeUrl;
    private static String secretKey;

    public static SttResponse Stt(SttRequest request) {
        RestClient client = RestClient.create();
        try {
            return client.post()
                .uri(invokeUrl + "/recognizer/object-storage")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-CLOVASPEECH-API-KEY", secretKey)
                .body(request)
                .retrieve()
                .body(SttResponse.class);
        } catch (HttpClientErrorException e) {
            throw new SttException();
        }
    }

    @Value("${api-keys.stt.invoke-url}")
    private void setInvokeUrl(String url) {
        invokeUrl = url;
    }

    @Value("${api-keys.stt.secret-key}")
    private void setSecretKey(String key) {
        secretKey = key;
    }
}
