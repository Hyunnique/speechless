package speechless.member.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import speechless.member.domain.Member;
import speechless.member.domain.MemberType;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmailAndMemberType(String email, MemberType memberType);

    default Member getById(Long memberId){
        return findById(memberId).orElseThrow();
    }
}
