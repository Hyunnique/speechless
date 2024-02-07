package speechless.interview.domain.repository;

import java.util.List;
import java.util.Optional;
import javax.swing.text.html.Option;
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
        + "JOIN InterviewQuestion iq "
        + "ON i.id = :id "
        + "AND i.isCompletion = true "
        + "AND i.member = :member "
        + "AND i = iq.interviewInfo")
    Optional<InterviewInfo> findByIdAndMember(Long id, Member member);

    Page<InterviewInfo> findAllByMemberAndCompletionIsTrue(Member member, Pageable pageable);

    default InterviewInfo findByInterviewId(Long id) {
        return findById(id).orElseThrow(InterviewNotFoundException::new);
    }

}
