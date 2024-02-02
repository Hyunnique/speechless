package speechless.community.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.community.domain.Community;
import speechless.member.domain.Member;

import java.util.Optional;

public interface CommnunityRepository extends JpaRepository<Community, Long> {
    Optional<Community> findByTitle(String title);
    Optional<Community> findByWriter(Member writer);

}
