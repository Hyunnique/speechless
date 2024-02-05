package speechless.interview.application.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public class Message {

    private String role;
    private String content;

    public Message(UserType role, String content) {
        this.role = role.getType();
        this.content = content;
    }

    @Override
    public String toString() {
        return "{\n" +
            "\t\"role\": " + role +
            ",\n\t\"content\": \"" + content + '\"' +
            "\n}";
    }

    public enum UserType {
        SYSTEM("system"), ASSISTANT("assistant"), USER("user"), TOOL("tool");

        private String type;

        UserType(String type) {
            this.type = type;
        }

        @JsonValue
        public String getType() {
            return this.type;
        }
    }
}
