package speechless.interview.presentation;

import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;
import speechless.interview.application.InterviewInfoService;
import speechless.interview.application.InterviewQuestionService;
import speechless.interview.application.dto.request.QuestionRequest;
import speechless.interview.application.dto.response.InterviewInfoResponse;
import speechless.interview.application.dto.response.InterviewListResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewInfoService interviewService;
    private final InterviewQuestionService questionService;

    @GetMapping("")
    public ResponseEntity<InterviewListResponse> getInterviews(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestParam Integer pageSize, @RequestParam Integer pageNum
    ) throws Exception {
        return new ResponseEntity<>(
            interviewService.getInterviewInfos(authCredentials, pageSize, pageNum),
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
        @RequestBody @Validated QuestionRequest request
    ) throws Exception {
        questionService.asyncCreateQuestion(authCredentials.id(), request);
        return new ResponseEntity<>("OK", HttpStatus.CREATED);
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<InterviewInfoResponse>> getMonthlyInterviews(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestParam("year") Integer year, @RequestParam("month") Integer month
    ) throws Exception {
        return new ResponseEntity<>(
            interviewService.getMonthlyInterviewInfo(authCredentials, year, month), HttpStatus.OK);
    }

}
