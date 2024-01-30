package speechless.session.speechToText.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SttRequest {

    private String dataKey;
    private String language;
    private String completion;
}
