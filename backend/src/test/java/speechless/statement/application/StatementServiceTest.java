package speechless.statement.application;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import speechless.statement.domain.repository.StatementRepository;

// Service 테스트
@ExtendWith(MockitoExtension.class)
public class StatementServiceTest {

    @Mock
    private StatementRepository repository;

    @InjectMocks
    private StatementService service;

    @Test
    @DisplayName("자기소개서 입력 서비스 테스트")
    public void createStatement() {
        
        /*
         Id 입력 및 비교를 위해서 별도로 repository를 통한 실제 저장이 필요하므로
         별도 서비스 로직 추가 시 업데이트
         */

    }

}
