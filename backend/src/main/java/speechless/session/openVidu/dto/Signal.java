package speechless.session.openVidu.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Map;

public record Signal(
    String session,
    SignalType type,
    String data) {

    public enum SignalType {
        QUESTION("question"), FEEDBACK("feedback"), ERROR("error");

        private String type;

        SignalType(String type) {
            this.type = type;
        }

        @JsonValue
        public String getType() {
            return this.type;
        }
    }

}
