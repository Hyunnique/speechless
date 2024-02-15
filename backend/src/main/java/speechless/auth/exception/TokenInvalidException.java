package speechless.auth.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class TokenInvalidException extends SpeechlessException {
    public TokenInvalidException() {
        super(new ErrorCode(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰임"));
    }
}
