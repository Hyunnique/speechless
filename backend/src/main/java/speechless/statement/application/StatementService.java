package speechless.statement.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.response.StatementListResponse;
import speechless.statement.application.dto.response.StatementResponse;
import speechless.statement.domain.Statement;
import speechless.statement.domain.StatementQuestion;
import speechless.statement.domain.mapper.StatementMapper;
import speechless.statement.domain.mapper.StatementQuestionMapper;
import speechless.statement.domain.repository.StatementRepository;
import speechless.statement.excepiton.StatementNotFoundException;

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

    public StatementListResponse getStatements(int pageSize, int pageNum) {

        // TODO : member Id 추가
        // 인덱스 값 descending 정렬 => 최신순
        Page<Statement> statements = statementRepository
            .findAllByMemberId(1L, PageRequest.of(pageNum - 1, pageSize,
                Sort.by("id").descending()));

        // response 파싱
        Page<StatementResponse> responsePage = statements.map(StatementMapper.INSTANCE::toResponse);
        return new StatementListResponse(
            responsePage.getContent(), responsePage.getNumber() + 1,
            responsePage.getTotalPages() + 1, responsePage.getTotalElements());
    }

    public StatementResponse getStatement(Long id) {

        // TODO : Member id 추가
        Statement statement = statementRepository.findByMemberIdAndId(1L, id)
            .orElseThrow(StatementNotFoundException::new);

        return StatementMapper.INSTANCE.toResponse(statement);
    }

}
