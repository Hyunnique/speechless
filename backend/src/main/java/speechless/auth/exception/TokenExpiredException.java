package speechless.auth.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class TokenExpiredException extends SpeechlessException {
    public TokenExpiredException() {
        super(new ErrorCode(HttpStatus.UNAUTHORIZED, "토큰이 만료되었습니다."));
    }
}
