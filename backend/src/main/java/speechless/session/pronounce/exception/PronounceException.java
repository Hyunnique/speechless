package speechless.session.pronounce.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class PronounceException extends SpeechlessException {

    public PronounceException() {
        super(new ErrorCode(HttpStatus.BAD_REQUEST, "발음 평가 api에서 문제가 발생하였습니다."));
    }
}