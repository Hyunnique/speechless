package speechless.statement.excepiton;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class NotAllowedStatementException extends SpeechlessException {

    public NotAllowedStatementException() {
        super(new ErrorCode(UNAUTHORIZED, "접근 불가능한 자기소개서입니다"));
    }

}
