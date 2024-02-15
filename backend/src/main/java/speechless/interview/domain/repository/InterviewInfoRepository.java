package speechless.interview.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import speechless.interview.domain.InterviewInfo;
import speechless.interview.exception.InterviewNotFoundException;
import speechless.member.domain.Member;

public interface InterviewInfoRepository extends JpaRepository<InterviewInfo, Long> {

    List<InterviewInfo> findAllByMember(Member member);

    @Query("SELECT i FROM InterviewInfo i "
        + "LEFT JOIN i.questions "
        + "WHERE i.id = :id "
        + "AND i.isCompletion = true "
        + "AND i.member = :member ")
    Optional<InterviewInfo> findByIdAndMember(Long id, Member member);

    Page<InterviewInfo> findAllByMemberAndIsCompletionIsTrue(Member member, Pageable pageable);

    List<InterviewInfo> findAllByMemberAndStartTimeBetweenAndIsCompletionIsTrue(
        Member member, LocalDateTime startDate, LocalDateTime endDate);

    default InterviewInfo findByInterviewId(Long id) {
        return findById(id).orElseThrow(InterviewNotFoundException::new);
    }

}
