package speechless.session.openVidu.presentation;

import static speechless.session.speechToText.utils.SttUtil.Stt;
import static speechless.session.storage.utils.FileUtil.deleteFile;
import static speechless.session.storage.utils.FileUtil.uploadFile;
import static speechless.session.storage.utils.RecordingUtil.getFileName;
import static speechless.session.storage.utils.RecordingUtil.getSessionId;
import static speechless.session.storage.utils.RecordingUtil.unzipFile;

import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Recording;
import io.openvidu.java.client.Recording.OutputMode;
import io.openvidu.java.client.RecordingProperties;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import speechless.interview.application.InterviewQuestionService;
import speechless.session.openVidu.dto.request.RecordRequest;
import speechless.session.speechToText.dto.SttRequest;
import speechless.session.speechToText.dto.SttResponse;

@RequiredArgsConstructor
@RestController
@RequestMapping("/openvidu/recording")
public class RecordController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private Map<String, Boolean> sessionRecordings = new ConcurrentHashMap<>();

    private OpenVidu openVidu;

    private InterviewQuestionService interviewQuestionService;

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
            return new ResponseEntity<>(recording.getId(), HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/stop/{recordingId}")
    public ResponseEntity<?> stopRecording(
        @PathVariable("recordingId") String recordingId,
        @RequestBody RecordRequest recordRequest
    ) throws Exception {

        try {
            Recording recording = this.openVidu.stopRecording(recordingId);
            this.sessionRecordings.remove(recording.getSessionId());
            Path sourcePath = Paths.get(
                "/opt/openvidu/recordings/" + recordingId + "/" + recordingId + ".zip");
            Path targetPath = Paths.get("/opt/openvidu/recordings/" + recordingId);
            unzipFile(sourcePath, targetPath);
            String fileName = getFileName(recordingId);
            String sessionId = getSessionId(recordingId);
            
            uploadFile(fileName,
                "/opt/openvidu/recordings/" + recordingId + "/" + fileName);

            SttRequest request = new SttRequest(fileName, "ko-KR", "sync");
            SttResponse response = Stt(request);

            interviewQuestionService.asyncCreateFeedback(recordRequest.interviewId(),
                sessionId, recordRequest.question(), response.getText());

            this.openVidu.deleteRecording(recordingId);
            deleteFile(fileName);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (OpenViduJavaClientException | OpenViduHttpException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendFinalResult(@RequestBody Map<String, Object> params) {
        // 받은 값 저장
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
