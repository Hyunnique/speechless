package speechless.statement.application.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor // AllArgsConstructor 상속 불가
@NoArgsConstructor
public class StatementQuestionUpdateRequest {

    private Long id;

    private String question;

    private String answer;

}
