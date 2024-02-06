package speechless.interview.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speechless.common.error.SpeechlessException;
import speechless.interview.application.dto.GptRequest;
import speechless.interview.application.dto.GptResponse;
import speechless.interview.application.dto.Message;
import speechless.interview.application.dto.Message.UserType;
import speechless.interview.application.dto.request.QuestionRequest;
import speechless.interview.application.dto.response.InterviewQuestionResponse;
import speechless.interview.domain.InterviewInfo;
import speechless.interview.domain.InterviewQuestion;
import speechless.interview.domain.mapper.InterviewQuestionMapper;
import speechless.interview.domain.repository.InterviewInfoRepository;
import speechless.interview.utils.GptUtil;
import speechless.session.openVidu.dto.Signal;
import speechless.session.openVidu.utils.SignalUtil;
import speechless.statement.domain.Statement;
import speechless.statement.domain.StatementQuestion;
import speechless.statement.domain.repository.StatementRepository;
import speechless.statement.excepiton.StatementNotFoundException;

@RequiredArgsConstructor
@Service
public class InterviewQuestionService {

    private final String MODEL = "gpt-4";

    private final Float TEMPERATURE = 0.2f;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final SignalUtil signalUtil;

    private final InterviewInfoRepository interviewInfoRepository;

    private final StatementRepository statementRepository;

    private GptResponse callGpt(String sessionId, List<Message> messages) throws Exception {
        GptResponse response;

        try {
            response = GptUtil.call(new GptRequest(MODEL, messages, TEMPERATURE));
        } catch (SpeechlessException e) {

            // Exception to response
            Map<String, Object> data = new HashMap<>();
            data.put("name", e.getClass().getSimpleName());
            data.put("message", e.getErrorCode().message());

            signalUtil.sendSignal(new Signal(sessionId, objectMapper.writeValueAsString(data)));

            throw e;
        }

        return response;
    }

    @Transactional
    @Async
    public void asyncCreateQuestion(
        Long memberId, QuestionRequest request)
        throws Exception {

        Statement statement = statementRepository.findByMemberIdAndId(memberId,
                request.statementId())
            .orElseThrow(StatementNotFoundException::new);

        List<Message> gptMessage = new ArrayList<>(2);

        // 시스템 설정 및 본 질문 생성
        gptMessage.add(
            new Message(UserType.SYSTEM, createQuestionSystemMessage(statement)));

        gptMessage.add(
            new Message(UserType.USER, "질문은 별도 안내 없이 " + request.questionCnt() + "개만 해줘"));

        statement.getQuestions().forEach(
            question -> gptMessage.add(
                new Message(UserType.USER, createQuestionUserMessage(question)))
        );

        GptResponse gptResponse = callGpt(request.sessionId(), gptMessage);

        // 질문 파싱
        List<String> data = parsingQuestion(gptResponse, request.questionCnt());
        signalUtil.sendSignal(new Signal(request.sessionId(), objectMapper.writeValueAsString(data)));
    }

    // 질문 배경 질의 생성
    private String createQuestionSystemMessage(Statement statement) {

        StringBuilder sb = new StringBuilder(350);
        sb.append("너는 기업의 인사담당자로서 새로운 직원을 뽑는 면접관으로 일하고 있어.")
            .append("너는 아주 깐깐하고 예리한 질문을 하는 기술 면접관이야.")
            .append("너는 아래에 주어진 기업 정보, 지원자의 자기소개서를 기반으로 나에게 면접 질문을 해줘.")
            .append("그리고 질문을 평문으로 작성하고 마지막에 개행문자를 넣어줘");

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

    @Transactional
    @Async
    public void asyncCreateFeedback(
        Long interviewId, String sessionId, String question, String answer
    ) throws Exception {

        InterviewInfo interview = interviewInfoRepository.findByInterviewId(interviewId);

        List<Message> gptMessage = new ArrayList<>(2);

        gptMessage.add(new Message(UserType.SYSTEM, createFeedbackSystemMessage()));
        gptMessage.add(new Message(UserType.USER, createFeedbackUserMessage(question, answer)));

        GptResponse response = callGpt(sessionId, gptMessage);

        String feedback = response.getChoices().get(0).getMessage().getContent();
        InterviewQuestion questionEntity = InterviewQuestion.builder()
            .question(question).answer(answer).feedback(feedback).build();

        interview.addQuestion(questionEntity);
        interviewInfoRepository.save(interview);

        InterviewQuestionResponse data = InterviewQuestionMapper.INSTANCE.questionToResponse(questionEntity);
        signalUtil.sendSignal(new Signal(sessionId, objectMapper.writeValueAsString(data)));

    }

    private String createFeedbackSystemMessage() {

        StringBuilder sb = new StringBuilder(350);
        sb.append("너는 기업의 인사담당자로서 새로운 직원을 뽑는 면접관으로 일하고 있어.")
            .append("너는 아주 깐깐하고 예리한 질문을 하는 기술 면접관이야.");

        return sb.toString();
    }

    private String createFeedbackUserMessage(String question, String answer) {

        StringBuilder sb = new StringBuilder();
        sb.append("너는 아래에 주어진 질문과 답변을 주면 얼마나 적합한지 안내문구 없이 평문으로 피드백해줘.")
            .append("<<<질문>>>").append(question)
            .append("<<<답변>>>").append(answer);

        return sb.toString();

    }

}
