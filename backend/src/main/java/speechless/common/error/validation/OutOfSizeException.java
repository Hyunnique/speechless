package speechless.common.error.validation;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class OutOfSizeException extends SpeechlessException {

    public OutOfSizeException() {
        super(new ErrorCode(BAD_REQUEST, "사이즈를 초과하여 요청할 수 없습니다"));
    }

}
