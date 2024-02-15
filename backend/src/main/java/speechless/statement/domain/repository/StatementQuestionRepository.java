package speechless.statement.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.statement.domain.StatementQuestion;

public interface StatementQuestionRepository extends JpaRepository<StatementQuestion, Long> {

}
