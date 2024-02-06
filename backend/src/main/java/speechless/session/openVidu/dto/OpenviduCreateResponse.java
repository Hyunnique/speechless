package speechless.session.openVidu.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OpenviduCreateResponse {
    private String sessionId;
    private Long interviewId;
}
