package speechless.common.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import org.springframework.http.HttpStatus;

@JsonInclude(Include.NON_NULL)
public record ErrorResponse(
    String name, String message, String trace, HttpStatus status) {

    @Override
    public String toString() {
        return "{\n" +
                "\t\"name\": " + name +
                ",\n\t\"message\": \"" + message + '\"' +
                ",\n\t\"trace\": \"" + trace + '\"' +
                ",\n\t\"status\": \"" + status + '\"' +
                "\n}";
    }

}