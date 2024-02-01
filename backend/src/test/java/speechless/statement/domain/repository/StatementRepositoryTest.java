//package speechless.statement.domain.repository;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import org.assertj.core.api.Assertions;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.http.HttpStatus;
//import org.springframework.transaction.annotation.Transactional;
//import speechless.common.error.ErrorCode;
//import speechless.common.error.SpeechlessException;
//import speechless.statement.application.dto.request.StatementQuestionRequest;
//import speechless.statement.application.dto.request.StatementRequest;
//import speechless.statement.domain.Statement;
//import speechless.statement.domain.StatementQuestion;
//import speechless.statement.domain.mapper.StatementMapper;
//import speechless.statement.domain.mapper.StatementQuestionMapper;
//
//// repository (JPA) 테스트
//@DataJpaTest
//@AutoConfigureTestDatabase(replace = Replace.NONE)
//public class StatementRepositoryTest {
//
//    @Autowired
//    private StatementRepository repository;
//
//    @Autowired
//    private StatementQuestionRepository questionRepository;
//
//    @DisplayName("자기소개서 입력 테스트")
//    @Test
//    @Transactional
//    public void StatementSaveTest() {
//
//        // given
//        StatementRequest statementRequest = getSaveRequest();
//
//        // request 처리
//        Statement statement = getStatement(statementRequest);
//
//        // when
//        Statement result = repository.save(statement);
//
//        // then
//        Assertions.assertThat(result.getTitle()).isSameAs(statement.getTitle());
//        Assertions.assertThat(result.getCompany()).isSameAs(statement.getCompany());
//        Assertions.assertThat(result.getPosition()).isSameAs(statement.getPosition());
//        Assertions.assertThat(result.getCareer()).isSameAs(statement.getCareer());
//        Assertions.assertThat(result.getQuestions().get(1).getId())
//            .isSameAs(statement.getQuestions().get(1).getId());
//    }
//
//    @DisplayName("자기소개서 목록 테스트")
//    @Test
//    @Transactional
//    public void statementsReadTest() {
//
//        // given
//        Page<Statement> list = repository.findAllByMemberId(1L,
//            PageRequest.of(0, 1));
//
//        Long tn = list.getTotalElements();
//
//        StatementRequest statementRequest1 = getSaveRequest();
//        StatementRequest statementRequest2 = getSaveRequest();
//
//        // request 처리
//        Statement statement1 = getStatement(statementRequest1);
//        Statement statement2 = getStatement(statementRequest2);
//
//        repository.save(statement1);
//        repository.save(statement2);
//
//        // when
//        list = repository.findAllByMemberId(1L,
//            PageRequest.of(0, 1));
//
//        Assertions.assertThat(Long.valueOf(list.getTotalPages())).isSameAs(tn + 2);
//        Assertions.assertThat(list.getNumber()).isSameAs(0);
//        Assertions.assertThat(list.getSize()).isSameAs(1);
//    }
//
//
//    @DisplayName("자기소개서 상세 테스트")
//    @Test
//    @Transactional
//    public void statementReadTest() {
//
//        // given
//        StatementRequest statementRequest = getSaveRequest();
//
//        // request 처리
//        Statement statement = getStatement(statementRequest);
//
//        repository.save(statement);
//
//        Statement result = repository.findByMemberIdAndId(statement.getMemberId(),
//                statement.getId())
//            .orElseThrow(() -> new SpeechlessException(new ErrorCode(
//                HttpStatus.INTERNAL_SERVER_ERROR, "자기소개서를 찾을 수 없습니다")));
//
//        Assertions.assertThat(result.getId()).isSameAs(statement.getId());
//        Assertions.assertThat(result.getQuestions().size())
//            .isSameAs(statement.getQuestions().size());
//
//    }
//
//    @DisplayName("자기소개서 삭제 테스트")
//    @Test
//    @Transactional
//    public void statementDeleteTest() {
//
//        StatementRequest statementRequest = getSaveRequest();
//        Statement statement = getStatement(statementRequest);
//        repository.save(statement);
//
//        repository.deleteById(statement.getId());
//
//        Optional<Statement> result = repository.findById(statement.getId());
//
//        Assertions.assertThat(result.isPresent()).isFalse();
//    }
//
//    @DisplayName("자기소개서 상세 테스트")
//    @Test
//    @Transactional
//    public void statementUpdateTest() {
//
//        StatementRequest statementRequest = getSaveRequest();
//        Statement statement = getStatement(statementRequest);
//        repository.save(statement);
//
//        StatementQuestionRequest newQuestion = new StatementQuestionRequest(
//            "새 문항", "새 답변"
//        );
//
//        StatementQuestion question = StatementQuestionMapper.INSTANCE.toEntity(newQuestion)
//            .toBuilder().statement(statement).build();
//
//        question = questionRepository.save(question);
//        List<StatementQuestion> questionList = statement.getQuestions();
//        List<StatementQuestion> newList = new ArrayList<>();
//        newList.add(question);
//
//        statement = statement.toBuilder()
//            .title("새로운 제목")
//            .questions(newList)
//            .build();
//
//        questionRepository.deleteAll(questionList);
//        repository.save(statement);
//        repository.flush();
//
//        Statement updateStatement = repository.findById(statement.getId())
//            .orElseThrow(RuntimeException::new);
//
//        Assertions.assertThat(updateStatement.getTitle()).isSameAs("새로운 제목");
//        Assertions.assertThat(updateStatement.getQuestions().size()).isSameAs(1);
//    }
//
//    private StatementRequest getSaveRequest() {
//
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
//        return new StatementRequest(
//            "제목", "회사", "직무", 0, questions
//        );
//
//    }
//
//    private Statement getStatement(StatementRequest request) {
//
//        Statement statement = StatementMapper.INSTANCE
//            .toEntity(request).toBuilder().memberId(1L).build();
//
//        request.getQuestions().forEach(
//            (question) -> {
//                StatementQuestion sq = StatementQuestionMapper.INSTANCE
//                    .toEntity(question).toBuilder().statement(statement).build();
//
//                statement.addQuestion(sq);
//            }
//        );
//
//        return statement;
//    }
//}
