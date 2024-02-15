package speechless.interview.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class GptBadRequestException extends SpeechlessException {

    public GptBadRequestException() {
        super(new ErrorCode(BAD_REQUEST, "잘못된 요청으로 인한 API 오류"));
    }

}
