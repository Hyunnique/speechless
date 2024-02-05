package speechless.interview.exception;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

public class InterviewNotFoundException extends SpeechlessException {

    public InterviewNotFoundException() {
        super(new ErrorCode(BAD_REQUEST, "해당 인터뷰를 찾지 못했습니다"));
    }

}