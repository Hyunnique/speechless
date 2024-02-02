package speechless.common.error;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import java.io.IOException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.HandlerMethod;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 서비스 정의 에러
    @ExceptionHandler(SpeechlessException.class)
    public ResponseEntity<ErrorResponse> resSpeechlessException(
        Throwable e,
        HandlerMethod handlerMethod) throws IOException {

        SpeechlessException exception = (SpeechlessException) e;
        ErrorResponse response = new ErrorResponse(
            exception.getClass().getSimpleName(),
            exception.getErrorCode().message(),
            exception.getStackTrace()[0].toString(),
            exception.getErrorCode().status()
        );

        return new ResponseEntity<>(response, exception.getErrorCode().status());
    }

    // Validation (@Valid) 에러
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> resBindException(
        Throwable e,
        HandlerMethod handlerMethod) throws IOException {

        MethodArgumentNotValidException exception = (MethodArgumentNotValidException) e;

        List<ObjectError> messageList = exception.getAllErrors();
        StringBuilder message = new StringBuilder();
        for (ObjectError objectError : messageList) {

            String validationMessage = objectError.getDefaultMessage();
            message.append("[").append(validationMessage).append("]");
        }

        ErrorResponse response = new ErrorResponse(
            exception.getClass().getSimpleName(),
            message.toString(),
            exception.getStackTrace()[0].toString(),
            HttpStatus.BAD_REQUEST
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Validation (@Validated) 에러
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> ValidatedException(
        Throwable e,
        HandlerMethod handlerMethod) throws IOException {

        ConstraintViolationException exception = (ConstraintViolationException) e;

        ConstraintViolation<?> constraintViolation = exception.getConstraintViolations().stream()
            .findFirst().orElseThrow();
        String message = constraintViolation.getMessageTemplate();

        ErrorResponse response = new ErrorResponse(
            exception.getClass().getSimpleName(),
            message,
            exception.getStackTrace()[0].toString(),
            HttpStatus.BAD_REQUEST
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Unhandled 에러
    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorResponse> resUnhandledException(
        Throwable e,
        HandlerMethod handlerMethod) throws IOException {

        // MatterMost 발송?
        ErrorResponse response = new ErrorResponse(
            e.getClass().getSimpleName(),
            "처리되지 않은 에러입니다 : " + e.getMessage(),
            e.getStackTrace()[0].toString(),
            HttpStatus.INTERNAL_SERVER_ERROR
        );

        log.error(response.message(), e);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
