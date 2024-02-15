package speechless.community.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class ExceedCapacityException extends SpeechlessException{

    public ExceedCapacityException() {
        super(new ErrorCode(HttpStatus.BAD_REQUEST, "정원을 초과하였습니다."));
    }
}