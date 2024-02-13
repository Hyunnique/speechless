package speechless.community.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class CommunityNotFoundException extends SpeechlessException {
    public CommunityNotFoundException() {super(new ErrorCode(HttpStatus.BAD_REQUEST, "커뮤니티를 찾을 수 없습니다."));}
}
