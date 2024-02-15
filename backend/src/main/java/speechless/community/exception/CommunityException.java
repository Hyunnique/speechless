package speechless.community.exception;

import static java.lang.String.format;

public class CommunityException extends RuntimeException{
    public CommunityException(String message) {
        super(message);
    }

    public static class NotFound extends CommunityException {
        public NotFound(Long id) {
            super(format("글번호가 %d 인 글을 찾을 수 없습니다.", id));
        }
    }
}
