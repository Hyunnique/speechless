package speechless.interview.domain.repository;

import java.util.List;
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
        + "AND i.member = :member "
        + "AND i = iq.interviewInfo")
    InterviewInfo findByIdAndMember(Long id, Member member);

    default InterviewInfo findByInterviewId(Long id) {
        return findById(id).orElseThrow(InterviewNotFoundException::new);
    }

}
