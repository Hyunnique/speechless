package speechless.statement.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import speechless.statement.application.StatementService;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.response.StatementListResponse;
import speechless.statement.application.dto.response.StatementResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statements")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StatementController {

    private final StatementService statementService;

    //  차후 Validation 처리
    @PostMapping("")
    public ResponseEntity<StatementResponse> createStatement(
        @RequestBody StatementRequest request) {
        return new ResponseEntity<>(statementService.createStatement(request), HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<StatementListResponse> getStatements(
        @RequestParam int pageSize, @RequestParam int pageNum) {

        return new ResponseEntity<>(
            statementService.getStatements(pageSize, pageNum), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatementResponse> getStatement(@PathVariable("id") Long id) {
        return new ResponseEntity<>(statementService.getStatement(id), HttpStatus.OK);
    }

}
