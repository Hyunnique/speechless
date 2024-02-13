package speechless.community.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class ParticipantNotFoundException extends SpeechlessException {
    public ParticipantNotFoundException(){super(new ErrorCode(HttpStatus.BAD_REQUEST, "참여 정보를 찾을 수 없습니다."));}
}
