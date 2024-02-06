package speechless.interview.presentation;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;
import speechless.interview.application.InterviewQuestionService;
import speechless.interview.application.dto.request.QuestionRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interview")
public class InterviewController {

    private final InterviewQuestionService questionService;

    @PostMapping("/question")
    public ResponseEntity<String> createQuestion(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestBody QuestionRequest request
    ) throws Exception {
        questionService.asyncCreateQuestion(authCredentials.id(), request);
        return new ResponseEntity<>("OK", HttpStatus.CREATED);
    }

}
