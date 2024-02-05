package speechless.interview.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class GptServerErrorException extends SpeechlessException {

    public GptServerErrorException() {
        super(new ErrorCode(INTERNAL_SERVER_ERROR, "API 서버 처리 실패"));
    }

}
