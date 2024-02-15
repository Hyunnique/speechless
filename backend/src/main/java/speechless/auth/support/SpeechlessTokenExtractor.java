package speechless.auth.support;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import speechless.auth.exception.TokenMissingException;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SpeechlessTokenExtractor {
    private static String header = "Refresh";

    public static String extract(HttpServletRequest request) {
        String authorization = request.getHeader(header);
        validate(authorization);
        return authorization.trim();
    }

    private static void validate(String authorization) {
        if(authorization == null){
            throw new TokenMissingException();
        }
    }
}
