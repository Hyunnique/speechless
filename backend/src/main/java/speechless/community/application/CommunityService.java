package speechless.community.application;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speechless.community.domain.Community;
import speechless.community.domain.repository.CommnunityRepository;
import speechless.community.dto.request.CreateCommunityRequest;
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
    private final CommnunityRepository commnunityRepository;

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
        return commnunityRepository.findById(communityId).orElseThrow(() ->new CommunityException.NotFound(communityId));
    }

    public List<Community> getCommunityList(){
        return commnunityRepository.findAll();
    }


    public void deleteCommunity(Long memberId, Long communityId) {
        Community community = commnunityRepository.findById(communityId).orElseThrow(RuntimeException::new);
        if (community.getWriter().getId() != memberId) {
            throw new CommunityDeleteException();
        }
        commnunityRepository.deleteById(communityId);
    }

}
