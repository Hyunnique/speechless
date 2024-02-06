package speechless.session.openVidu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OpenviduDeleteRequest {
    private Long interviewId;
    private Integer pronounceScore;
    private Integer faceScore;
    private String faceGraph;
}
