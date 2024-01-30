package speechless.statement.application.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class StatementRequest {

    private String title;

    private String company;

    private String position;

    private int career;

    private List<StatementQuestionRequest> questions;

}
