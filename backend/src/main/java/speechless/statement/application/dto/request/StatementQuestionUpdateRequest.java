package speechless.statement.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor // AllArgsConstructor 상속 불가
@NoArgsConstructor
public class StatementQuestionUpdateRequest {

    @Positive
    private Long id;

    @NotBlank
    @NotNull
    @Size(max = 200)
    private String question;

    @NotBlank
    @NotNull
    @Size(max = 1000)
    private String answer;

}
