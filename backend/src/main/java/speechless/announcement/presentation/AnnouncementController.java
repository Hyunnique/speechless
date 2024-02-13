package speechless.announcement.presentation;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import speechless.announcement.application.AnnouncementService;
import speechless.announcement.domain.Announcement;
import speechless.announcement.dto.AnnouncementCreateRequest;
import speechless.announcement.exception.NotRegisteredParticipantException;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/openvidu/announcement")
public class AnnouncementController {
  @Value("${OPENVIDU_URL}")
  private String OPENVIDU_URL;

  @Value("${OPENVIDU_SECRET}")
  private String OPENVIDU_SECRET;

  private OpenVidu openvidu;

  @PostConstruct
  public void init() {
    this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
  }

  private  AnnouncementService announcementService;

  @PostMapping("")
  public ResponseEntity<String> initializeSession(
      @RequestBody AnnouncementCreateRequest request,
      @Parameter(hidden = true) @Auth AuthCredentials authCredentials)
      throws Exception {
    Announcement announcement = announcementService.findAnnouncement(request.communityId());
    if(announcement != null) return new ResponseEntity<>(announcement.getAnnouncementId(), HttpStatus.ALREADY_REPORTED);
    SessionProperties properties = new SessionProperties.Builder().build();
    Session session = openvidu.createSession(properties);
    announcementService.createAnnouncement(request, session.getSessionId());
    return new ResponseEntity<>(session.getSessionId(), HttpStatus.CREATED);
  }

  @DeleteMapping("/{sessionId}")
  public ResponseEntity<Void> deleteSession(
      @PathVariable("sessionId") String sessionId)
      throws OpenViduJavaClientException, OpenViduHttpException {
    Session session = openvidu.getActiveSession(sessionId);
    session.close();
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @PostMapping("/{sessionId}/connections")
  public ResponseEntity<Map> createConnection(@PathVariable("sessionId") String sessionId,
      @RequestBody(required = false) @Parameter Map<String, Object> params,
      @Auth AuthCredentials authCredentials)
      throws OpenViduJavaClientException, OpenViduHttpException {
    Session session = openvidu.getActiveSession(sessionId);
    if (session == null) {
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    if(announcementService.isParticipant(sessionId, authCredentials) == null)
      throw new NotRegisteredParticipantException();
    ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
    Connection connection = session.createConnection(properties);
    Map<String, String> connectionInfo = new HashMap<>();
    connectionInfo.put("token", connection.getToken());
    connectionInfo.put("connectionId", connection.getConnectionId());
    return new ResponseEntity<>(connectionInfo, HttpStatus.OK);
  }

  @DeleteMapping("/{sessionId}/connection/{connectionId}")
  public ResponseEntity<Void> deleteConnection(@PathVariable("sessionId") String sessionId,
      @PathVariable("connectionId") String connectionId,
      @Parameter(hidden = true) @Auth AuthCredentials authCredentials)
      throws OpenViduJavaClientException, OpenViduHttpException {
    Session session = openvidu.getActiveSession(sessionId);
    session.forceDisconnect(connectionId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
