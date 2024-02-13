package speechless.community.dto.response;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import speechless.member.domain.Member;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantCommunityResponse {

    private Long id;

    private String title;

    private Date sessionStart;

}
