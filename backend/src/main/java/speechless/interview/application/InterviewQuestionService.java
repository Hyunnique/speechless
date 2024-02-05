package speechless.interview.application;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speechless.auth.dto.AuthCredentials;
import speechless.common.error.SpeechlessException;
import speechless.interview.application.dto.GptRequest;
import speechless.interview.application.dto.GptResponse;
import speechless.interview.application.dto.Message;
import speechless.interview.application.dto.Message.UserType;
import speechless.interview.domain.InterviewInfo;
import speechless.interview.domain.InterviewQuestion;
import speechless.interview.domain.repository.InterviewInfoRepository;
import speechless.interview.exception.InterviewNotFoundException;
import speechless.interview.utils.GptUtil;
import speechless.statement.domain.Statement;
import speechless.statement.domain.StatementQuestion;
import speechless.statement.domain.repository.StatementRepository;
import speechless.statement.excepiton.StatementNotFoundException;

@RequiredArgsConstructor
@Service
public class InterviewQuestionService {

    private final String model = "gpt-4";

    private final InterviewInfoRepository interviewInfoRepository;

    private final StatementRepository statementRepository;

    @Transactional
    @Async
    public void asyncCreateQuestion(
        AuthCredentials authCredentials, Long interviewId, Long statementId, Integer questionCnt)
        throws Exception {

        Statement statement = statementRepository.findByMemberIdAndId(authCredentials.id(),
                statementId)
            .orElseThrow(StatementNotFoundException::new);

        // TODO : 인터뷰(세션) 정보 추가
        InterviewInfo interview = interviewInfoRepository.findById(interviewId)
            .orElseThrow(InterviewNotFoundException::new);

        List<Message> requestMessage = new ArrayList<>(2);

        // 시스템 설정 및 본 질문 생성
        requestMessage.add(
            new Message(UserType.SYSTEM, createQuestionSystemMessage(statement)));

        requestMessage.add(
            new Message(UserType.USER, "질문은 별도 안내 없이 " + questionCnt + "개만 해줘"));

        statement.getQuestions().forEach(
            question -> requestMessage.add(
                new Message(UserType.USER, createQuestionUserMessage(question)))
        );

        GptResponse gptResponse;
        try {
            gptResponse = GptUtil.call(new GptRequest(model, requestMessage));
        } catch (SpeechlessException e) {

            // TODO : Exception 정보 사용자에게 전달

            throw e;
        }

        // 질문 파싱
        List<String> content = parsingQuestion(gptResponse, questionCnt);

        // 질문 저장
        content.forEach(data -> {

            InterviewQuestion question = InterviewQuestion.builder()
                .question(data).build();

            interview.addQuestion(question);
        });

        interviewInfoRepository.save(interview);

        // TODO : 생성된 질문 전달
    }

    // 질문 배경 질의 생성
    private String createQuestionSystemMessage(Statement statement) {

        StringBuilder sb = new StringBuilder(350);
        sb.append("너는 기업의 인사담당자로서 새로운 직원을 뽑는 면접관으로 일하고 있어.")
            .append("너는 아주 깐깐하고 예리한 질문을 하는 기술 면접관이야.")
            .append("너는 아래에 주어진 기업 정보, 지원자의 자기소개서를 기반으로 나에게 면접 질문을 해줘.");

        // 기업 정보
        sb.append("<<<기업정보>>>")
            .append(statement.getCompany());

        // 지원 직무
        sb.append("<<<지원직무>>>")
            .append(statement.getPosition());

        // 경력 여부
        sb.append("<<<경력여부>>>")
            .append(statement.getCareer())
            .append("년차");

        return sb.toString();
    }

    // 본 질문에 필요한 정보 생성
    private String createQuestionUserMessage(StatementQuestion question) {

        StringBuilder sb = new StringBuilder(2500);

        sb.append("<<<자기소개서>>>")
            .append("<<질문>>").append(question.getQuestion())
            .append("<<답변>>").append(question.getAnswer());

        return sb.toString();
    }

    private List<String> parsingQuestion(GptResponse response, Integer questionCnt) {

        String content = response.getChoices().get(0).getMessage().getContent();

        List<String> questions = new ArrayList<>(questionCnt);

        StringTokenizer st = new StringTokenizer(content, "\n", false);
        while (st.hasMoreTokens()) {

            String question = st.nextToken();
            if (question.isEmpty()) {
                continue;
            }

            questions.add(question);
        }

        return questions;
    }

}
