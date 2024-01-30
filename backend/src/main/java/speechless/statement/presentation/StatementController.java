package speechless.statement.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import speechless.statement.application.StatementService;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.response.StatementResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statements")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StatementController {

    private final StatementService statementService;

    @PostMapping("")
    public ResponseEntity<StatementResponse> createStatement(
        @RequestBody StatementRequest request) {
        return new ResponseEntity<>(statementService.createStatement(request), HttpStatus.CREATED);
    }

}
