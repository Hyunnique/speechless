package speechless.statement.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.statement.domain.Statement;

public interface StatementRepository extends JpaRepository<Statement, Long> {

}
