package speechless.session.speechToText.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class SttException extends SpeechlessException {

    public SttException() {
        super(new ErrorCode(HttpStatus.BAD_REQUEST, "stt api에서 문제가 발생하였습니다."));
    }
}
