package speechless.statement.application;

import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import speechless.auth.dto.AuthCredentials;
import speechless.auth.support.JwtProvider;
import speechless.statement.application.dto.response.StatementListResponse;
import speechless.statement.application.dto.response.StatementResponse;
import speechless.statement.domain.Statement;
import speechless.statement.domain.repository.StatementRepository;

// Service 테스트
@ExtendWith(MockitoExtension.class)
public class StatementServiceTest {

    @Mock
    private StatementRepository repository;

    @InjectMocks
    private StatementService service;

    private final AuthCredentials authCredentials = new AuthCredentials(1L);

    @Test
    @DisplayName("자기소개서 입력 서비스 테스트")
    public void createStatement() {
        
        /*
         Id 입력 및 비교를 위해서 별도로 repository를 통한 실제 저장이 필요하므로
         별도 서비스 로직 추가 시 업데이트
         */

    }

    @Test
    @DisplayName("자기소개서 목록 테스트")
    public void getStatements() {

        Statement statement = Statement.builder()
            .title("제목")
            .company("회사")
            .position("직무")
            .career(0)
            .build();

        List<Statement> statementList = new ArrayList<>();
        statementList.add(statement);

        //given
        when(repository
            .findAllByMemberId(1L,
                PageRequest.of(0, 1,
                    Sort.by("id").descending())
            )).thenReturn(new PageImpl<>(statementList));

        // when
        StatementListResponse response = service.getStatements(1, 1, authCredentials);

        Assertions.assertThat(response.statements().size()).isSameAs(1);
        Assertions.assertThat(response.currentPage()).isSameAs(1);

    }

    @Test
    @DisplayName("자기소개서 목록 테스트")
    public void getStatement() {

        Statement statement = Statement.builder()
            .id(1L)
            .memberId(1L)
            .title("제목")
            .company("회사")
            .position("직무")
            .career(0)
            .build();

        when(repository
            .findByMemberIdAndId(1L, 1L))
            .thenReturn(Optional.of(statement));

        StatementResponse response = service.getStatement(1L, authCredentials);

        Assertions.assertThat(response.getId()).isSameAs(1L);

    }

    @Test
    @DisplayName("자기소개서 삭제 테스트")
    public void deleteStatement() {

        // 삭제는 별도 로직이 없으므로 로그인 유저 검증 추가되면 체크

    }

    @Test
    @DisplayName("자기소개서 수정 테스트")
    public void updateStatement() {

        // 수정은 별도 로직이 없으므로 로그인 유저 검증 추가 후 체크

    }

}
