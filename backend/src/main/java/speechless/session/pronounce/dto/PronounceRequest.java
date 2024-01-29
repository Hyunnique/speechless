package speechless.session.pronounce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PronounceRequest {

    private String requestId;
    private Argument argument;

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Argument {

        private String language_code;
        private String script;
        private String audio;
    }
}