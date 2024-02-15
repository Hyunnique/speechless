package speechless.statement.domain.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import speechless.member.domain.Member;
import speechless.statement.domain.Statement;

public interface StatementRepository extends JpaRepository<Statement, Long> {

    Page<Statement> findAllByMember(Member member, Pageable pageable);

    @Query(value = "SELECT s FROM Statement s "
        + "JOIN s.questions "
        + "ON s.member.id = :memberId "
        + "AND s.id = :id ")
    Optional<Statement> findByMemberIdAndId(Long memberId, Long id);
}
