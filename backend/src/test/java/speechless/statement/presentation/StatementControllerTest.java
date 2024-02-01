//package speechless.statement.presentation;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import java.util.ArrayList;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import org.springframework.transaction.annotation.Transactional;
//import speechless.auth.presentation.JwtArgumentResolver;
//import speechless.statement.application.StatementService;
//import speechless.statement.application.dto.request.StatementQuestionRequest;
//import speechless.statement.application.dto.request.StatementRequest;
//import speechless.statement.application.dto.request.StatementUpdateRequest;
//
//// Controller 테스트
//@ExtendWith(MockitoExtension.class)
//@SpringBootTest
//@AutoConfigureMockMvc
//@Transactional
//public class StatementControllerTest {
//
//    @Autowired
//    private MockMvc mvc;
//
//    @Mock
//    private StatementService service;
//
//    @Mock
//    private JwtArgumentResolver jwtArgumentResolver;
//
//    @InjectMocks
//    private StatementController controller;
//
//    @BeforeEach
//    public void init() { // mockMvc 초기화, 각메서드가 실행되기전에 초기화 되게 함
//        mvc = MockMvcBuilders.standaloneSetup(controller).build();
//        //  standaloneMockMvcBuilder() 호출하고 스프링 테스트의 설정을 커스텀하여 mockMvc 객체 생성
//    }
//
//    ObjectMapper objectMapper = new ObjectMapper();
//
//    String accessToken = "token";
//
//    @Test
//    @DisplayName("자기소개서 입력")
//    void createStatement() throws Exception {
//
//        // given
//        StatementQuestionRequest questionRequest1 = new StatementQuestionRequest(
//            "문항1", "답변1"
//        );
//
//        StatementQuestionRequest questionRequest2 = new StatementQuestionRequest(
//            "문항2", "답변2"
//        );
//
//        ArrayList<StatementQuestionRequest> questions = new ArrayList<>(2);
//        questions.add(questionRequest1);
//        questions.add(questionRequest2);
//
//        StatementRequest statementRequest = new StatementRequest(
//            "제목", "회사", "직무", 0, questions
//        );
//
//        // TODO : 로그인 인증 로직 추가
//        // when & then
//        mvc.perform(post("/statements")
//            .content(objectMapper.writeValueAsString(statementRequest))
//            .contentType(MediaType.APPLICATION_JSON)
//        ).andExpect(status().isCreated());
//    }
//
//    @Test
//    @DisplayName("자기소개서 리스트")
//    void getStatements() throws Exception {
//
//        mvc.perform(get("/statements")
//            .param("pageSize", "1")
//            .param("pageNum", "1")
//            .contentType(MediaType.APPLICATION_JSON)
//        ).andExpect(status().isOk());
//    }
//
//    @Test
//    @DisplayName("자기소개서 상세보기")
//    void getStatement() throws Exception {
//
//        mvc.perform(get("/statements/1")
//            .contentType(MediaType.APPLICATION_JSON)
//        ).andExpect(status().isOk());
//    }
//
//    @Test
//    @DisplayName("자기소개서 삭제")
//    void deleteStatement() throws Exception {
//
//        mvc.perform(delete("/statements/1")
//        ).andExpect(status().isNoContent());
//    }
//
//    @Test
//    @DisplayName("자기소개서 수정")
//    void updateStatement() throws Exception {
//
//        StatementUpdateRequest request = new StatementUpdateRequest(
//            1L, "제목", "회사", "직무", 0, null
//        );
//
//        mvc.perform(put("/statements")
//            .content(objectMapper.writeValueAsString(request))
//            .contentType(MediaType.APPLICATION_JSON)
//        ).andExpect(status().isOk());
//    }
//
//}
