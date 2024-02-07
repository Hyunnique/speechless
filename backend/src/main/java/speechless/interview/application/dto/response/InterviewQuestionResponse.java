package speechless.interview.application.dto.response;

public record InterviewQuestionResponse(
    Long id,
    Long interviewId,
    String question,
    String answer,
    String feedback
) {

}
