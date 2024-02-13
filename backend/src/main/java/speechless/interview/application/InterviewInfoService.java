package speechless.interview.application;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import speechless.auth.dto.AuthCredentials;
import speechless.common.error.validation.PageException;
import speechless.interview.application.dto.response.InterviewInfoResponse;
import speechless.interview.application.dto.response.InterviewListResponse;
import speechless.interview.domain.InterviewInfo;
import speechless.interview.domain.mapper.InterviewInfoMapper;
import speechless.interview.domain.repository.InterviewInfoRepository;
import speechless.interview.exception.InterviewNotFoundException;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;
import speechless.member.exception.MemberNotFoundException;
import speechless.session.openVidu.dto.OpenviduDeleteRequest;

@Service
@RequiredArgsConstructor
public class InterviewInfoService {

    private final InterviewInfoRepository interviewRepository;
    private final MemberRepository memberRepository;

    public Long createInterviewInfo(AuthCredentials authCredentials, String topic)
        throws Exception {

        Member loginMember = memberRepository.getById(authCredentials.id());

        InterviewInfo interviewInfo = InterviewInfo.builder()
            .member(loginMember)
            .startTime(LocalDateTime.now())
            .topic(topic).build();

        interviewRepository.save(interviewInfo);

        return interviewInfo.getId();
    }

    public void updateInterviewInfo(OpenviduDeleteRequest request) {

        if (isCompletion(request)) {
            return;
        }

        InterviewInfo interviewInfo = interviewRepository.findByInterviewId(
            request.getInterviewId());

        interviewInfo = interviewInfo.toBuilder()
            .faceScore(request.getFaceScore())
            .faceGraph(request.getFaceGraph())
            .pronunciationScore(request.getPronunciationScore())
            .pronunciationGraph(request.getPronunciationGraph())
            .isCompletion(true)
            .endTime(LocalDateTime.now())
            .build();

        interviewRepository.save(interviewInfo);
    }

    private boolean isCompletion(OpenviduDeleteRequest request) {
        return request.getPronunciationGraph() == null || request.getFaceGraph() == null;
    }

    public InterviewListResponse getInterviewInfos(AuthCredentials authCredentials,
        Integer pageSize, Integer pageNum) {

        if (pageNum < 1 || pageSize < 1 || pageSize > 50) {
            throw new PageException();
        }

        Member loginMember = getMember(authCredentials);

        Page<InterviewInfo> interviewInfos = interviewRepository.findAllByMemberAndIsCompletionIsTrue(
            loginMember, PageRequest.of(pageNum - 1, pageSize, Sort.by("id").descending()));

        Page<InterviewInfoResponse> responsePage = interviewInfos.map(
            InterviewInfoMapper.INSTANCE::toResponse);
        return new InterviewListResponse(
            responsePage.getContent(), responsePage.getNumber() + 1,
            responsePage.getTotalPages(), responsePage.getTotalElements()
        );
    }


    public InterviewInfoResponse getInterviewInfo(AuthCredentials authCredentials, Long id) {

        Member loginMember = memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);

        return InterviewInfoMapper.INSTANCE.toResponse(
            interviewRepository.findByIdAndMember(id, loginMember)
                .orElseThrow(InterviewNotFoundException::new));

    }

    private Member getMember(AuthCredentials authCredentials) {
        return memberRepository.findById(authCredentials.id())
            .orElseThrow(MemberNotFoundException::new);
    }
}
