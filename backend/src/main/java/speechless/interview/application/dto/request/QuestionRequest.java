package speechless.interview.application.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;

public record QuestionRequest(

    @Positive
    Long interviewId,

    @Positive
    Long statementId,

    String sessionId,

    @Positive
    @Max(5)
    Integer questionCnt
) {

}
