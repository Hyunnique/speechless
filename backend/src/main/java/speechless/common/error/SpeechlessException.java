package speechless.common.error;

import lombok.Getter;

@Getter
public class SpeechlessException extends RuntimeException{
    private final ErrorCode errorCode;

    public SpeechlessException(ErrorCode errorCode) {
        super(errorCode.message());
        this.errorCode = errorCode;
    }
}
