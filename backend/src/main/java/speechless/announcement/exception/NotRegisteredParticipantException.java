package speechless.announcement.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class NotRegisteredParticipantException extends SpeechlessException {
  public NotRegisteredParticipantException(){
    super(new ErrorCode(HttpStatus.UNAUTHORIZED, "참여할 수 있는 세션이 아닙니다."));
  }
}
