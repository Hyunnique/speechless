package speechless.session.storage.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class StorageServiceException extends SpeechlessException {

    public StorageServiceException() {
        super(new ErrorCode(HttpStatus.BAD_REQUEST, "storage api에서 문제가 발생하였습니다."));
    }
}
