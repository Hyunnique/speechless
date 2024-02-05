package speechless.common.error.validation;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class PageException extends SpeechlessException {

    public PageException() {
        super(new ErrorCode(BAD_REQUEST, "요청한 페이지로 실행할 수 없습니다"));
    }

}