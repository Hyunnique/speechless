package speechless.statement.domain.repository;

import java.util.ArrayList;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.transaction.annotation.Transactional;
import speechless.statement.application.dto.request.StatementQuestionRequest;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.domain.Statement;
import speechless.statement.domain.StatementQuestion;
import speechless.statement.domain.mapper.StatementMapper;
import speechless.statement.domain.mapper.StatementQuestionMapper;

// repository (JPA) 테스트
@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
public class StatementRepositoryTest {

    @Autowired
    private StatementRepository repository;

    private Statement statement;

    @DisplayName("자기소개서 입력 테스트")
    @Test
    @Transactional
    public void StatementSaveTest() {

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

        // request 처리
        Statement statement = StatementMapper.INSTANCE
            .toEntity(statementRequest).toBuilder().memberId(1L).build();

        statementRequest.getQuestions().forEach(
            (question) -> {
                StatementQuestion sq = StatementQuestionMapper.INSTANCE
                    .toEntity(question).toBuilder().statement(statement).build();

                statement.getQuestions().add(sq);
            }
        );

        // when
        Statement result = repository.save(statement);

        // then
        Assertions.assertThat(result.getTitle()).isSameAs(statement.getTitle());
        Assertions.assertThat(result.getCompany()).isSameAs(statement.getCompany());
        Assertions.assertThat(result.getPosition()).isSameAs(statement.getPosition());
        Assertions.assertThat(result.getCareer()).isSameAs(statement.getCareer());
        Assertions.assertThat(result.getQuestions().get(1).getId())
            .isSameAs(statement.getQuestions().get(1).getId());
    }

}
