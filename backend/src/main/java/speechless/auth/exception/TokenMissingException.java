package speechless.auth.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class TokenMissingException extends SpeechlessException {
   public TokenMissingException(){
       super(new ErrorCode(HttpStatus.UNAUTHORIZED, "토큰이 필요합니다."));
   }
}
