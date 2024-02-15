package speechless.statement.application.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatementResponse {

    private Long id;

    private Long memberId;

    private String title;

    private String company;

    private String position;

    private int career;

    private List<StatementQuestionResponse> questions;

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

}
