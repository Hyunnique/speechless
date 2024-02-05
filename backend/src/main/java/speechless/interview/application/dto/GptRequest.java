package speechless.interview.application.dto;

import java.util.List;

public record GptRequest(String model, List<Message> messages) {

    @Override
    public String toString() {
        return "{\n" +
            "\t\"role\": " + model +
            ",\n\t\"content\": \"" + messages + '\"' +
            "\n}";
    }
}
