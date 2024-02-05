package speechless.interview.application.dto.response;

public record InterviewQuestionResponse(
    Long id,
    Long InterviewId,
    String question,
    String answer,
    String feedback
) {

}
