package speechless.interview.application.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewInfoResponse {

    private Long id;

    private Long memberId;

    private String topic;

    private Integer pronunciationScore;

    private String pronunciationGraph;

    private Integer faceScore;

    private String faceGraph;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private List<InterviewQuestionResponse> questions = new ArrayList<>();
}
