package speechless.community.domain.repository;

public interface CustomParticipantRepository {
    boolean existsByCommunityIdAndMemberId(Long communityId, Long memberId);
}
