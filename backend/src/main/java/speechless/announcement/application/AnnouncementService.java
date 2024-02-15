package speechless.announcement.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speechless.announcement.domain.Announcement;
import speechless.announcement.domain.repository.AnnouncementRepository;
import speechless.announcement.dto.AnnouncementCreateRequest;
import speechless.announcement.exception.NotFoundAnnouncementException;
import speechless.auth.dto.AuthCredentials;
import speechless.common.error.SpeechlessException;
import speechless.community.domain.Community;
import speechless.community.domain.Participant;
import speechless.community.domain.repository.CommunityRepository;
import speechless.community.domain.repository.ParticipantRepository;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;
import speechless.member.exception.MemberNotFoundException;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final CommunityRepository commnunityRepository;
    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;

    public Announcement createAnnouncement(
        AnnouncementCreateRequest request, String sessionId)
        throws SpeechlessException {
        Community community = commnunityRepository.getById(request.communityId());
        Announcement announcement = Announcement.builder()
            .topic(request.topic())
            .community(community)
            .announcementId(sessionId)
            .build();
        announcementRepository.save(announcement);
        return announcement;
    }

    public Announcement findAnnouncement(Long communityId) {
        Community community = commnunityRepository.getById(communityId);
        Announcement announcement = announcementRepository.findByCommunity(community).orElse(null);
        return announcement;
    }

    public Participant isParticipant(String sessionId, AuthCredentials authCredentials) {
        Announcement announcement = announcementRepository.findByAnnouncementId(sessionId)
            .orElseThrow(NotFoundAnnouncementException::new);
        Member member = getMember(authCredentials);
        return participantRepository.findByMemberAndCommunity(member, announcement.getCommunity())
            .orElse(null);
    }

    private Member getMember(AuthCredentials authCredentials) throws SpeechlessException {
        return memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);
    }
}
