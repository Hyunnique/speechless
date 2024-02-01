package speechless.session.openVidu.presentation;

import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.Recording.OutputMode;
import io.openvidu.java.client.RecordingProperties;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@OpenAPIDefinition(tags = @Tag(name = "RecordController", description = "Openvidu의 비디오 세션에서 녹화를 시작, 종료합니다."))
@RestController
@RequestMapping("/openvidu/recording")
public class RecordController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    private OpenVidu openVidu;

    @PostConstruct
    public void init() {
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @PostMapping("/start/{sessionId}")
    public ResponseEntity<?> startRecording(@PathVariable("sessionId") String sessionId) {

        RecordingProperties properties = new RecordingProperties.Builder().outputMode(
                OutputMode.INDIVIDUAL).hasAudio(true)
            .hasVideo(false).build();

        try {
            Recording recording = this.openVidu.startRecording(sessionId, properties);
            this.sessionRecordings.put(sessionId, true);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/stop/{recordingId}")
    public ResponseEntity<?> stopRecording(@PathVariable("recordingId") String recordingId) {

        try {
            Recording recording = this.openVidu.stopRecording(recordingId);
            this.sessionRecordings.remove(recording.getSessionId());
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{recordingId}")
    public ResponseEntity<?> deleteRecording(@PathVariable("recordingId") String recordingId) {

        try {
            this.openVidu.deleteRecording(recordingId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get/{recordingId}")
    public ResponseEntity<?> getRecording(@PathVariable(value = "recordingId") String recordingId) {

        try {
            Recording recording = this.openVidu.getRecording(recordingId);
            return new ResponseEntity<>(recording, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listRecordings() {

        try {
            List<Recording> recordings = this.openVidu.listRecordings();

            return new ResponseEntity<>(recordings, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
