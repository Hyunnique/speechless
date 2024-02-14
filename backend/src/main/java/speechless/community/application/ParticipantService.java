package speechless.community.application;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import speechless.auth.dto.AuthCredentials;
import speechless.common.error.SpeechlessException;
import speechless.common.error.validation.PageException;
import speechless.community.domain.Community;
import speechless.community.domain.Participant;
import speechless.community.domain.mapper.ParticipantMapper;
import speechless.community.domain.repository.CommunityRepository;
import speechless.community.domain.repository.ParticipantRepository;
import speechless.community.dto.response.ParticipantCommunityResponse;
import speechless.community.dto.response.ParticipantListResponse;
import speechless.community.exception.CommunityNotFoundException;
import speechless.community.exception.NotAllowedParticipantException;
import speechless.community.exception.ParticipantExistException;
import speechless.community.exception.ParticipantNotFoundException;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;
import speechless.member.exception.MemberNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;
    private final CommunityRepository commnunityRepository;

    public Participant createParticipant(AuthCredentials authCredentials, Long communityId)
        throws SpeechlessException {
        Member loginMember = getMember(authCredentials);
        Community participantCommunity = getCommunity(communityId);
        if (participantRepository.existsByCommunityIdAndMemberId(communityId,
            loginMember.getId())) {
            throw new ParticipantExistException();
        }
        Participant participant = Participant.builder()
            .member(loginMember)
            .community(participantCommunity)
            .build();
        participantRepository.save(participant);

        return participant;
    }

    public void deleteParticipant(AuthCredentials authCredentials, Long communityId)
        throws SpeechlessException {

        Community community = getCommunity(communityId);
        Participant participant = participantRepository.findByMemberAndCommunity(
                getMember(authCredentials), community)
            .orElseThrow(ParticipantNotFoundException::new);
        checkAuth(authCredentials, participant);

        participantRepository.delete(participant);
    }

    public ParticipantListResponse getFinishedParticipants(
        AuthCredentials authCredentials, Integer pageSize, Integer pageNum)
        throws SpeechlessException {

        if (pageNum < 1 || pageSize < 1 || pageSize > 50) {
            throw new PageException();
        }

        Member loginMember = getMember(authCredentials);

        Page<Community> communities = participantRepository.findFinishedByMember(loginMember,
            PageRequest.of(pageNum - 1, pageSize, Sort.by("id").descending()));

        Page<ParticipantCommunityResponse> responsePage = communities.map(
            ParticipantMapper.INSTANCE::toResponse);
        return new ParticipantListResponse(
            responsePage.getContent(), responsePage.getNumber() + 1, responsePage.getTotalPages(),
            responsePage.getTotalElements());
    }

    public ParticipantListResponse getReservedParticipants(
        AuthCredentials authCredentials, Integer pageSize, Integer pageNum)
        throws SpeechlessException {
        if (pageNum < 1 || pageSize < 1 || pageSize > 50) {
            throw new PageException();
        }

        Member loginMember = getMember(authCredentials);

        Page<Community> communities = participantRepository.findReservedByMember(loginMember,
            PageRequest.of(pageNum - 1, pageSize, Sort.by("id").descending()));

        Page<ParticipantCommunityResponse> responsePage = communities.map(
            ParticipantMapper.INSTANCE::toResponse);
        return new ParticipantListResponse(
            responsePage.getContent(), responsePage.getNumber() + 1, responsePage.getTotalPages(),
            responsePage.getTotalElements());
    }

    public List<ParticipantCommunityResponse> getCurrentParticipants(
        AuthCredentials authCredentials)
        throws SpeechlessException {
        Member loginMember = getMember(authCredentials);
        List<Community> communities = participantRepository.findCurrentByMember(loginMember)
            .orElse(new ArrayList<>());
        return communities.stream().map(ParticipantMapper.INSTANCE::toResponse).toList();
    }

    public List<ParticipantCommunityResponse> getNextParticipants(
        AuthCredentials authCredentials)
        throws SpeechlessException {
        Member loginMember = getMember(authCredentials);
        List<Community> communities = participantRepository.findNextByMember(loginMember)
            .orElse(new ArrayList<>());
        return communities.stream().map(ParticipantMapper.INSTANCE::toResponse).toList();
    }

    public Integer getParticipantNumber(Long communityId) throws SpeechlessException {
        Community community = getCommunity(communityId);
        return participantRepository.findAllByCommunity(community).orElse(new ArrayList<>()).size();
    }

    public Participant getParticipant(Long id) throws SpeechlessException {
        return participantRepository.findById(id)
            .orElseThrow(ParticipantNotFoundException::new);
    }

    private Member getMember(AuthCredentials authCredentials) throws SpeechlessException {
        return memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);
    }

    private Community getCommunity(Long communityId) throws SpeechlessException {
        return commnunityRepository.findById(communityId)
            .orElseThrow(CommunityNotFoundException::new);
    }

    private void checkAuth(AuthCredentials authCredentials, Participant participant)
        throws SpeechlessException {
        if (!authCredentials.id().equals(participant.getMember().getId())) {
            throw new NotAllowedParticipantException();
        }
    }
}
