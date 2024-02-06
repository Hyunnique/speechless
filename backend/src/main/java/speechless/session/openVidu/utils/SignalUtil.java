package speechless.session.openVidu.utils;

import java.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import speechless.session.openVidu.dto.Signal;

@Component
public class SignalUtil {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    public void sendSignal(Signal params) {
        RestClient client = RestClient.create();
        client.post()
            .uri(OPENVIDU_URL + "openvidu/signal")
            .header("Authorization",
                "Basic " + Base64.getEncoder().encodeToString(OPENVIDU_SECRET.getBytes()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(params)
            .retrieve();
    }
}
