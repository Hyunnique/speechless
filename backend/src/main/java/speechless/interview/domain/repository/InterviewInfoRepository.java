package speechless.interview.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.interview.domain.InterviewInfo;

public interface InterviewInfoRepository extends JpaRepository<InterviewInfo, Long> {

}
