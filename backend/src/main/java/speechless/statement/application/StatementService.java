package speechless.statement.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.response.StatementResponse;
import speechless.statement.domain.Statement;
import speechless.statement.domain.StatementQuestion;
import speechless.statement.domain.mapper.StatementMapper;
import speechless.statement.domain.mapper.StatementQuestionMapper;
import speechless.statement.domain.repository.StatementRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatementService {

    private final StatementRepository statementRepository;

    @Transactional
    public StatementResponse createStatement(StatementRequest request) {

        // TODO : 로그인 회원 입력 처리
        // request 처리
        Statement statement = StatementMapper.INSTANCE
            .toEntity(request).toBuilder().memberId(1L).build();

        if (statement.getQuestions() != null) {
            createStatementQuestions(request, statement);
        }

        statementRepository.save(statement);

        return StatementMapper.INSTANCE.toResponse(statement);
    }

    // 자기소개서 문항 생성
    private void createStatementQuestions(StatementRequest request, Statement statement) {

        request.getQuestions().forEach(
            (question) -> {
                StatementQuestion sq = StatementQuestionMapper.INSTANCE
                    .toEntity(question).toBuilder().statement(statement).build();

                statement.getQuestions().add(sq);
            }
        );
    }

}
