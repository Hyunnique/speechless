package speechless.community.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class CommunityUpdateException extends SpeechlessException {

    public CommunityUpdateException(){
        super(new ErrorCode(HttpStatus.UNAUTHORIZED, "자신이 작성한 글만 수정할 수 있습니다."));
    }
}
