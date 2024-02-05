package speechless.interview.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.interview.domain.InterviewQuestion;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {

}
