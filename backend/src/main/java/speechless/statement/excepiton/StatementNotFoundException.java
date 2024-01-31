package speechless.statement.excepiton;

import static org.springframework.http.HttpStatus.NOT_FOUND;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class StatementNotFoundException extends SpeechlessException {

    public StatementNotFoundException() {
        super(new ErrorCode(NOT_FOUND, "자기소개서를 찾을 수 없습니다!"));
    }

}