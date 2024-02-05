package speechless.interview.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import speechless.interview.application.dto.GptRequest;
import speechless.interview.application.dto.GptResponse;
import speechless.interview.exception.GptBadRequestException;
import speechless.interview.exception.GptServerErrorException;

@Component
public class GptUtil {

    private static String apiKey;

    public static GptResponse call(GptRequest request) throws Exception {

        RestClient client = RestClient.create();

        // TODO : Exception Class 구체화
        return client.post()
            .uri("https://api.openai.com/v1/chat/completions")
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer " + apiKey)
            .body(request)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                throw new GptBadRequestException();
            })
            .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                throw new GptServerErrorException();
            })
            .body(GptResponse.class);
    }

    @Value("${api-keys.gpt}")
    private void setApiKey(String key) {
        apiKey = key;
    }

}
