package speechless.interview.presentation;

import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;
import speechless.interview.application.InterviewInfoService;
import speechless.interview.application.InterviewQuestionService;
import speechless.interview.application.dto.request.QuestionRequest;
import speechless.interview.application.dto.response.InterviewInfoResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewInfoService interviewService;
    private final InterviewQuestionService questionService;

    @GetMapping("")
    public ResponseEntity<List<InterviewInfoResponse>> getInterviews(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials
    ) throws Exception {
        return new ResponseEntity<>(interviewService.getInterviewInfos(authCredentials),
            HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewInfoResponse> getInterview(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @PathVariable("id") Long id
    ) throws Exception {
        return new ResponseEntity<>(interviewService.getInterviewInfo(authCredentials, id),
            HttpStatus.OK);
    }

    @PostMapping("/question")
    public ResponseEntity<String> createQuestion(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestBody QuestionRequest request
    ) throws Exception {
        questionService.asyncCreateQuestion(authCredentials.id(), request);
        return new ResponseEntity<>("OK", HttpStatus.CREATED);
    }

}
