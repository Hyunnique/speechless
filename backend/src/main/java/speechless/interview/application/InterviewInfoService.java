package speechless.interview.application;

import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import speechless.auth.dto.AuthCredentials;
import speechless.interview.application.dto.response.InterviewInfoResponse;
import speechless.interview.domain.InterviewInfo;
import speechless.interview.domain.mapper.InterviewInfoMapper;
import speechless.interview.domain.repository.InterviewInfoRepository;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;
import speechless.member.exception.MemberNotFoundException;

@Service
@RequiredArgsConstructor
public class InterviewInfoService {

    private final InterviewInfoRepository interviewRepository;
    private final MemberRepository memberRepository;

    public Long createInterviewInfo(AuthCredentials authCredentials, String topic)
        throws Exception {

        InterviewInfo interviewInfo = InterviewInfo.builder()
            .startTime(LocalDateTime.now())
            .topic(topic).build();

        interviewRepository.save(interviewInfo);

        return interviewInfo.getId();
    }

    public void updateInterviewInfo(Long id, Integer pronounciationScore, Integer faceScore,
        String faceGraph) {
        InterviewInfo interviewInfo = interviewRepository.findByInterviewId(id);

        interviewInfo = interviewInfo.toBuilder()
            .faceScore(faceScore)
            .faceGraph(faceGraph)
            .pronunciationScore(pronounciationScore)
            .endTime(LocalDateTime.now())
            .build();

        interviewRepository.save(interviewInfo);
    }

    public List<InterviewInfoResponse> getInterviewInfos(AuthCredentials authCredentials) {

        Member loginMember = memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);

        List<InterviewInfo> interviewInfos = interviewRepository.findAllByMember(loginMember);
        return interviewInfos.stream().map(InterviewInfoMapper.INSTANCE::toResponse).toList();
    }

    public InterviewInfoResponse getInterviewInfo(AuthCredentials authCredentials, Long id) {

        Member loginMember = memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);

        return InterviewInfoMapper.INSTANCE.toResponse(interviewRepository.findByIdAndMember(id, loginMember));

    }
}
