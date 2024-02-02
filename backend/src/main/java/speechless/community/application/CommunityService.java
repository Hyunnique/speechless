package speechless.community.application;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speechless.community.domain.Community;
import speechless.community.domain.repository.CommnunityRepository;
import speechless.community.dto.request.CreateCommunityRequest;
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
            throw new RuntimeException();
        }
        community.setTitle(request.title());
        community.setContent(request.content());
        community.isPrivate(request.isPrivate());
        community.setDeadline(request.deadline());
        community.setSessionStart(request.sessionStart());
        community.setCategory(request.category());
        community.setMaxParticipants(request.maxParticipants());
        commnunityRepository.save(community);
    }

    public Community getCommunityById(Long communityId) {
        return commnunityRepository.findById(communityId).orElseThrow(RuntimeException::new);
    }

    public List<Community> getCommunityList(){
        return commnunityRepository.findAll();
    }


    public void deleteCommunity(Long memberId, Long communityId) {
        Community community = commnunityRepository.findById(communityId).orElseThrow(RuntimeException::new);
        if (community.getWriter().getId() != memberId) {
            throw new RuntimeException();
        }
        commnunityRepository.deleteById(communityId);
    }

}
