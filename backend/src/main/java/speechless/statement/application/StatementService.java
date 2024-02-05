package speechless.statement.application;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speechless.auth.dto.AuthCredentials;
import speechless.common.error.SpeechlessException;
import speechless.common.error.validation.PageException;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;
import speechless.member.exception.MemberNotFoundException;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.request.StatementUpdateRequest;
import speechless.statement.application.dto.response.StatementListResponse;
import speechless.statement.application.dto.response.StatementResponse;
import speechless.statement.domain.Statement;
import speechless.statement.domain.StatementQuestion;
import speechless.statement.domain.mapper.StatementMapper;
import speechless.statement.domain.mapper.StatementQuestionMapper;
import speechless.statement.domain.repository.StatementRepository;
import speechless.statement.excepiton.NotAllowedStatementException;
import speechless.statement.excepiton.StatementNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatementService {

    private final StatementRepository statementRepository;

    private final MemberRepository memberRepository;

    @Transactional
    public StatementResponse createStatement(StatementRequest request,
        AuthCredentials authCredentials) throws SpeechlessException {

        Member loginMember = getLoginUser(authCredentials);

        // request 처리
        Statement statement = StatementMapper.INSTANCE.toEntity(request);
        loginMember.addStatement(statement);

        if (statement.isQuestionEmpty()) {
            createStatementQuestions(request, statement);
        }

        statementRepository.save(statement);

        return StatementMapper.INSTANCE.toResponse(statement);
    }

    // 자기소개서 문항 생성
    private void createStatementQuestions(StatementRequest request, Statement statement) throws SpeechlessException {

        request.getQuestions().forEach(
            (question) -> {
                StatementQuestion sq = StatementQuestionMapper.INSTANCE.toEntity(question);
                statement.addQuestion(sq);
            }
        );
    }

    public StatementListResponse getStatements(int pageSize, int pageNum,
        AuthCredentials authCredentials) throws SpeechlessException {

        if (pageNum < 1 || pageSize < 1 || pageSize > 20) {
            throw new PageException();
        }

        Member loginMember = memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);

        // 인덱스 값 descending 정렬 => 최신순
        Page<Statement> statements = statementRepository
            .findAllByMember(loginMember, PageRequest.of(pageNum - 1, pageSize,
                Sort.by("id").descending()));

        // response 파싱
        Page<StatementResponse> responsePage = statements.map(StatementMapper.INSTANCE::toResponse);
        return new StatementListResponse(
            responsePage.getContent(), responsePage.getNumber() + 1,
            responsePage.getTotalPages(), responsePage.getTotalElements());
    }

    public StatementResponse getStatement(Long id, AuthCredentials authCredentials) throws SpeechlessException {

        Member loginMember = memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);

        Statement statement = statementRepository.findByMemberIdAndId(loginMember.getId(), id)
            .orElseThrow(StatementNotFoundException::new);

        return StatementMapper.INSTANCE.toResponse(statement);
    }

    @Transactional
    public void deleteStatement(Long id, AuthCredentials authCredentials) throws SpeechlessException {

        Statement statement = statementRepository.findById(id)
            .orElseThrow(StatementNotFoundException::new);

        checkAuth(authCredentials, statement);

        statementRepository.delete(statement);
    }


    @Transactional
    public StatementResponse updateStatement(StatementUpdateRequest request,
        AuthCredentials authCredentials) throws SpeechlessException {

        Member loginMember = memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);

        Statement statement = statementRepository.findById(request.getId())
            .orElseThrow(StatementNotFoundException::new);

        checkAuth(authCredentials, statement);

        Statement updateStatement = StatementMapper.INSTANCE
            .toEntity(request).toBuilder().member(loginMember).build();

        request.getQuestions().forEach(
            (questionRequest) -> {

                StatementQuestion question = StatementQuestionMapper.INSTANCE.toEntity(questionRequest);
                updateStatement.addQuestion(question);
            }
        );

        statement = updateStatement;
        statementRepository.save(statement);
        return StatementMapper.INSTANCE.toResponse(statement);
    }

    private Member getLoginUser(AuthCredentials authCredentials) throws SpeechlessException {

        return memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);
    }

    private void checkAuth(AuthCredentials authCredentials, Statement statement) throws SpeechlessException {
        if (!authCredentials.id().equals(statement.getMember().getId())) {
            throw new NotAllowedStatementException();
        }
    }

}
