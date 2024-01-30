package speechless.session.storage.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class StorageClientException  extends SpeechlessException {

    public StorageClientException() {
        super(new ErrorCode(HttpStatus.INTERNAL_SERVER_ERROR, "재요청 바랍니다."));
    }
}
