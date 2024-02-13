package speechless.community.application;

import java.util.ArrayList;
import java.util.List;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speechless.auth.dto.AuthCredentials;
import speechless.common.error.SpeechlessException;
import speechless.community.domain.Community;
import speechless.community.domain.Participant;
import speechless.community.domain.mapper.ParticipantMapper;
import speechless.community.domain.repository.CommunityRepository;
import speechless.community.domain.repository.ParticipantRepository;
import speechless.community.dto.response.ParticipantCommunityResponse;
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
        if (participantRepository.existsByCommunityIdAndMemberId(communityId, loginMember.getId())) {
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

    public List<ParticipantCommunityResponse> getFinishedParticipants(
        AuthCredentials authCredentials)
        throws SpeechlessException {
        Member loginMember = getMember(authCredentials);
        List<Community> communities = participantRepository.findFinishedByMember(loginMember)
            .orElse(new ArrayList<>());
        return communities.stream().map(ParticipantMapper.INSTANCE::toResponse).toList();
    }

    public List<ParticipantCommunityResponse> getReservedParticipants(
        AuthCredentials authCredentials)
        throws SpeechlessException {
        Member loginMember = getMember(authCredentials);
        List<Community> communities = participantRepository.findReservedByMember(loginMember)
            .orElse(new ArrayList<>());
        return communities.stream().map(ParticipantMapper.INSTANCE::toResponse).toList();
    }

    public List<ParticipantCommunityResponse> getCurrentParticipants(
        AuthCredentials authCredentials)
        throws SpeechlessException {
        Member loginMember = getMember(authCredentials);
        List<Community> communities = participantRepository.findCurrentByMember(loginMember)
            .orElse(new ArrayList<>());
        return communities.stream().map(ParticipantMapper.INSTANCE::toResponse).toList();
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
