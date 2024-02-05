package speechless.statement.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StatementQuestionRequest {

    @NotBlank
    @Size(max = 200)
    private String question;

    @NotBlank
    @Size(max = 1000)
    private String answer;

}
