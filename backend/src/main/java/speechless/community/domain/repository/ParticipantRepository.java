package speechless.community.domain.repository;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import speechless.community.domain.Community;
import speechless.community.domain.Participant;
import speechless.member.domain.Member;

public interface ParticipantRepository extends JpaRepository<Participant, Long>, CustomParticipantRepository  {

    Optional<Participant> findByMemberAndCommunity(Member member, Community community);
    @Query(value = "SELECT c FROM Participant p "
        + "JOIN Member m "
        + "ON m = :member "
        + "AND m = p.member "
        + "JOIN Community c "
        + "ON c.sessionStart < current_date "
        + "AND p.community = c")
    Page<Community> findFinishedByMember(Member member, Pageable pageable);

    @Query(value = "SELECT c FROM Participant p "
        + "JOIN Member m "
        + "ON m = :member "
        + "AND m = p.member "
        + "JOIN Community c "
        + "ON c.sessionStart >= current_date "
        + "AND p.community = c")
    Page<Community> findReservedByMember(Member member, Pageable pageable);

    @Query(value = "SELECT c FROM Participant p "
        + "JOIN Member m "
        + "ON m = :member "
        + "AND m = p.member "
        + "JOIN Community c "
        + "ON MONTH(c.sessionStart) = MONTH(current_date) "
        + "AND p.community = c")
    Optional<List<Community>> findCurrentByMember(Member member);

    @Query("SELECT c FROM Participant p "
        + "JOIN Member m "
        + "ON m = :member "
        + "AND m = p.member "
        + "JOIN Community c "
        + "ON c.sessionStart >= current_date "
        + "AND p.community = c "
        + "ORDER BY c.sessionStart ASC "
        + "LIMIT 3")
    Optional<List<Community>> findNextByMember(Member member);

}
