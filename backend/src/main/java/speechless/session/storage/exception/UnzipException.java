package speechless.session.storage.exception;

import org.springframework.http.HttpStatus;
import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class UnzipException extends SpeechlessException {

    public UnzipException() {
        super(new ErrorCode(HttpStatus.BAD_REQUEST, "파일 경로를 확인해주세요"));
    }
}
