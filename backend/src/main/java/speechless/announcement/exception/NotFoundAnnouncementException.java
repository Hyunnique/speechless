package speechless.announcement.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class NotFoundAnnouncementException extends SpeechlessException {
  public NotFoundAnnouncementException(){
    super(new ErrorCode(HttpStatus.NOT_FOUND, "참여할 수 있는 세션이 없습니다."));
  }
}
