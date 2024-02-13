package speechless.auth.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class RefreshTokenNotFoundException extends SpeechlessException {
    public RefreshTokenNotFoundException(){
        super(new ErrorCode(HttpStatus.UNAUTHORIZED, "존재하지 않는 리프레시 토큰입니다."));
    }

}
