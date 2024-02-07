package speechless.session.openVidu.dto;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OpenviduDeleteRequest {

    @Positive
    private Long interviewId;

    private Integer pronunciationScore;

    private String pronunciationGraph;

    private Integer faceScore;

    private String faceGraph;

}
