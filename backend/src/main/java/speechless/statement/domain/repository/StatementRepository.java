package speechless.statement.domain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import speechless.statement.domain.Statement;

public interface StatementRepository extends JpaRepository<Statement, Long> {

    Page<Statement> findAllByMemberId(Long memberId, Pageable pageable);

    @Query(value = "SELECT s FROM Statement s "
        + "JOIN s.questions "
        + "ON s.memberId = :memberId "
        + "AND s.id = :id ")
    Optional<Statement> findByMemberIdAndId(Long memberId, Long id);

}
