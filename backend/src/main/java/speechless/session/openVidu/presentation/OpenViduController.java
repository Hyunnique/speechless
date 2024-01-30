package speechless.session.openVidu.presentation;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import speechless.session.openVidu.application.SessionIdService;

@OpenAPIDefinition(tags = @Tag(name = "OpenViduController", description = "OpenVidu를 사용하여 비디오 세션을 관리하는 API. 세션 초기화, 연결 생성 및 고유 세션 ID 생성 기능을 제공합니다."))
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/openvidu")
public class OpenViduController {

	@Value("${OPENVIDU_URL}")
	private String OPENVIDU_URL;

	@Value("${OPENVIDU_SECRET}")
	private String OPENVIDU_SECRET;

	private OpenVidu openvidu;

	@Autowired
	private SessionIdService sessionIdService;

	@PostConstruct
	public void init() {
		this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
	}

	@PostMapping("/sessions")
	@Operation(summary = "새로운 비디오 세션을 초기화합니다.",
		description = "필요한 경우 세션 설정을 포함하여 새로운 비디오 세션을 생성합니다.")
	@ApiResponse(responseCode = "200", description = "새로운 세션 ID를 반환합니다.")
	@ApiResponse(responseCode = "401", description = "인증 실패, 비밀번호 불일치")
	public ResponseEntity<String> initializeSession(
		@RequestBody(required = false) @Parameter(description = "세션 생성에 사용될 설정 값. 옵션으로 지정 가능.") Map<String, Object> params)
		throws OpenViduJavaClientException, OpenViduHttpException {
		SessionProperties properties = SessionProperties.fromJson(params).build();
		Session session = openvidu.createSession(properties);
		return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
	}

	@PostMapping("/sessions/{sessionId}/connections")
	@Operation(summary = "지정된 세션 ID에 대한 새로운 연결을 생성합니다.",
		description = "지정된 세션에 참여할 수 있는 새로운 연결을 생성합니다.")
	@ApiResponse(responseCode = "200", description = "새로운 연결 토큰을 반환합니다.")
	@ApiResponse(responseCode = "404", description = "세션을 찾을 수 없습니다.")
	public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
		@RequestBody(required = false) @Parameter(description = "연결 생성에 사용될 설정 값. 옵션으로 지정 가능.") Map<String, Object> params)
		throws OpenViduJavaClientException, OpenViduHttpException {
		Session session = openvidu.getActiveSession(sessionId);
		if (session == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
		Connection connection = session.createConnection(properties);
		return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
	}

	@PostMapping("/session-id")
	@Operation(summary = "고유한 세션 ID를 생성합니다.",
		description = "새로운 고유한 세션 ID를 생성합니다.")
	@ApiResponse(responseCode = "201", description = "생성된 고유 세션 ID를 반환합니다.")
	public ResponseEntity<String> sessionId() {
		String uuid = sessionIdService.createUuid();
		return new ResponseEntity<>(uuid, HttpStatus.CREATED);
	}

	@ExceptionHandler(OpenViduJavaClientException.class)
	public ResponseEntity<String> handleClientException(OpenViduJavaClientException e) {
		return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(OpenViduHttpException.class)
	public ResponseEntity<String> handleHttpException(OpenViduHttpException e) {
		return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

