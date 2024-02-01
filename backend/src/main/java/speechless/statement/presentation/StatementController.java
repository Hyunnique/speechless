package speechless.statement.presentation;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.presentation.Auth;
import speechless.statement.application.StatementService;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.request.StatementUpdateRequest;
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
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestBody StatementRequest request) {
        return new ResponseEntity<>(statementService
            .createStatement(request, authCredentials),
            HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<StatementListResponse> getStatements(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestParam int pageSize,
        @RequestParam int pageNum) {

        return new ResponseEntity<>(statementService
            .getStatements(pageSize, pageNum, authCredentials),
            HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatementResponse> getStatement(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @PathVariable("id") Long id) {

        return new ResponseEntity<>(statementService
            .getStatement(id, authCredentials),
            HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatement(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @PathVariable("id") Long id) {

        statementService.deleteStatement(id, authCredentials);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("")
    public ResponseEntity<StatementResponse> updateStatement(
        @Parameter(hidden = true) @Auth AuthCredentials authCredentials,
        @RequestBody StatementUpdateRequest request) {

        return new ResponseEntity<>(statementService
            .updateStatement(request, authCredentials),
            HttpStatus.OK);
    }

}
