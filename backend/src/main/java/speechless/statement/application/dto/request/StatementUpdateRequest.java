package speechless.statement.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor // AllArgsConstructor 상속 불가
@NoArgsConstructor
public class StatementUpdateRequest {

    @Positive
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String title;

    @NotBlank
    @Size(max = 20)
    private String company;

    @NotBlank
    @Size(max = 30)
    private String position;

    @PositiveOrZero
    private int career;

    @Valid
    @Size(max = 5)
    private List<StatementQuestionUpdateRequest> questions;

}
