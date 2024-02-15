package speechless.community.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class ParticipantExistException extends SpeechlessException{
    public ParticipantExistException(){ super(new ErrorCode(HttpStatus.BAD_REQUEST, "이미 참여한 발표세션 입니다."));}
}
