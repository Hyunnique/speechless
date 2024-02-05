package speechless.session.openVidu.utils;

import java.util.Base64;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class SignalUtil {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    public ResponseEntity<Map> sendSignal(Map<String, String> params) {
        RestClient client = RestClient.create();
        client.post()
            .uri(OPENVIDU_URL + "openvidu/signal")
            .header("Authorization",
                "Basic " + Base64.getEncoder().encodeToString(OPENVIDU_SECRET.getBytes()))
            .contentType(MediaType.APPLICATION_JSON)
            .body(params)
            .retrieve();
        return new ResponseEntity<>(params, HttpStatus.OK);
    }
}
