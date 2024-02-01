package speechless.statement.application.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor // AllArgsConstructor 상속 불가
@NoArgsConstructor
public class StatementUpdateRequest {

    private Long id;

    private String title;

    private String company;

    private String position;

    private int career;

    private List<StatementQuestionUpdateRequest> questions;

}
