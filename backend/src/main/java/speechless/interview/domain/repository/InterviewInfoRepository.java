package speechless.interview.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.interview.domain.InterviewInfo;
import speechless.interview.exception.InterviewNotFoundException;

public interface InterviewInfoRepository extends JpaRepository<InterviewInfo, Long> {

    default InterviewInfo findByInterviewId(Long id) {
        return findById(id).orElseThrow(InterviewNotFoundException::new);
    }

}
