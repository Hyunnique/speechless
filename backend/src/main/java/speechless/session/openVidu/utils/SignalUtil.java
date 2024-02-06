package speechless.session.openVidu.utils;

import java.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import speechless.session.openVidu.dto.Signal;

@Slf4j
@Component
public class SignalUtil {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    public void sendSignal(Signal params) {
        RestClient client = RestClient.create();
        String temp= client.post()
            .uri(OPENVIDU_URL + "openvidu/api/signal")
            .header("Authorization",
                "Basic " + Base64.getEncoder().encodeToString(OPENVIDU_SECRET.getBytes()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(params)
            .retrieve()
            .body(String.class);

        log.info(temp);
    }
}
