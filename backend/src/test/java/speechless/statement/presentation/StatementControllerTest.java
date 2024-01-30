package speechless.statement.presentation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import speechless.statement.application.dto.request.StatementQuestionRequest;
import speechless.statement.application.dto.request.StatementRequest;

// Controller 테스트
@SpringBootTest
@AutoConfigureMockMvc
public class StatementControllerTest {

    @Autowired
    private MockMvc mvc;

    ObjectMapper objectMapper = new ObjectMapper();

    String accessToken = "token";

    @Test
    @DisplayName("자기소개서 입력")
    void createStatement() throws Exception {

        // given
        StatementQuestionRequest questionRequest1 = new StatementQuestionRequest(
            "문항1", "답변1"
        );

        StatementQuestionRequest questionRequest2 = new StatementQuestionRequest(
            "문항2", "답변2"
        );

        ArrayList<StatementQuestionRequest> questions = new ArrayList<>(2);
        questions.add(questionRequest1);
        questions.add(questionRequest2);

        StatementRequest statementRequest = new StatementRequest(
            "제목", "회사", "직무", 0, questions
        );

        // TODO : 로그인 인증 로직 추가
        // when & then
        mvc.perform(post("/statements")
            .content(objectMapper.writeValueAsString(statementRequest))
            .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(status().isCreated());
    }
}
