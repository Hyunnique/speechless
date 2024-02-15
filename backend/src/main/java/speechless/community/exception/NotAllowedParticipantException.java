package speechless.community.exception;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class NotAllowedParticipantException extends SpeechlessException {

    public NotAllowedParticipantException() {
        super(new ErrorCode(UNAUTHORIZED, "접근 불가능한 참여입니다"));
    }
}
