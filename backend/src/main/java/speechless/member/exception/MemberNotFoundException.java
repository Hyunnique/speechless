package speechless.member.exception;

import speechless.common.error.ErrorCode;
import speechless.common.error.SpeechlessException;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

public class MemberNotFoundException extends SpeechlessException {
    public MemberNotFoundException() {
        super(new ErrorCode(UNAUTHORIZED, "회원을 찾을 수 없습니다!"));
    }
}
