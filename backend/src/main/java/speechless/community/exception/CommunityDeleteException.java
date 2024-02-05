package speechless.community.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class CommunityDeleteException extends SpeechlessException {
    public CommunityDeleteException(){
        super(new ErrorCode(HttpStatus.UNAUTHORIZED, "자신이 작성한 글만 삭제할 수 있습니다."));
    }
}
