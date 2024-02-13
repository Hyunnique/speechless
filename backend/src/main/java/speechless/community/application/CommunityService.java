package speechless.community.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speechless.community.domain.Community;
import speechless.community.domain.repository.CommunityRepository;
import speechless.community.dto.request.CreateCommunityRequest;
import speechless.community.dto.response.GetCommunitiesResponse;
import speechless.community.exception.CommunityDeleteException;
import speechless.community.exception.CommunityException;
import speechless.community.exception.CommunityUpdateException;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommunityService {
    private final MemberRepository memberRepository;
    private final CommunityRepository commnunityRepository;

    public Community createCommunity(Long memberId, CreateCommunityRequest request) {
        Member member = memberRepository.getById(memberId);
        Community community = request.toEntity(member);
        return commnunityRepository.save(community);
    }

    public void updateCommunity(Long memberId, Long communityId, CreateCommunityRequest request) {
        Community community = commnunityRepository.findById(communityId).orElseThrow(RuntimeException::new);
        if (memberId != community.getWriter().getId()) {
            throw new CommunityUpdateException();
        }
        community.updateCommunity(request);
        commnunityRepository.save(community);
    }

    public Community getCommunityById(Long communityId) {
        Community community = commnunityRepository.findById(communityId)
                .orElseThrow(() -> new CommunityException.NotFound(communityId));
        community.increaseHit();
        commnunityRepository.save(community);
        return community;
    }

    public GetCommunitiesResponse getCommunityList(String title, String writerName, String content,
                                                   String category, Boolean recruiting, Integer maxParticipants,
                                                   Long cursor, int limit){
        List<Community> communities = commnunityRepository.searchCommunities(title, writerName, content, category, recruiting, maxParticipants, cursor, limit + 1);

        return prepareResponseWithPagination(communities, limit);
    }

    public GetCommunitiesResponse getPopularCommunities(Long cursor, int limit) {
        List<Community> communities = commnunityRepository.findPopularCommunities();
        return prepareResponseWithPagination(communities, limit);
    }

    public void deleteCommunity(Long memberId, Long communityId) {
        Community community = commnunityRepository.findById(communityId).orElseThrow(RuntimeException::new);
        if (community.getWriter().getId() != memberId) {
            throw new CommunityDeleteException();
        }
        commnunityRepository.deleteById(communityId);
    }


    private GetCommunitiesResponse prepareResponseWithPagination(List<Community> communities, int limit) {
        Long nextCursor = null;

        if (communities.size() > limit) {
            communities.remove(communities.size() - 1);
            nextCursor = communities.get(communities.size() - 1).getId();
        }

        return GetCommunitiesResponse.from(communities, nextCursor);
    }
}
