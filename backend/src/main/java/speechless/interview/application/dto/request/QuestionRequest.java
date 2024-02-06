package speechless.interview.application.dto.request;

public record QuestionRequest(
    Long interviewId,
    Long statementId,
    String sessionId,
    Integer questionCnt
) {

}
