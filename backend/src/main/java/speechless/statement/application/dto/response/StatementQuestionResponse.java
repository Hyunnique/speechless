package speechless.statement.application.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatementQuestionResponse {

    private Long id;

    private String question;

    private String answer;

    private Long statementId;

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

}
