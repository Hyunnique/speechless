package speechless.community.dto.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import speechless.community.domain.Community;
import speechless.member.domain.Member;

import java.util.Date;

public record CreateCommunityRequest(
//        @NotNull(message = "Null 값이 올 수 없습니다. 올바른 값인지 확인해주세요")
        String title,

//        @NotNull(message = "Null 값이 올 수 없습니다. 올바른 값인지 확인해주세요")
        @Size(max = 1000, message = "1000자 미만의 값을 입력해주세요.")
        String content,

        Date sessionStart,

        Date deadline,

//        @NotNull(message = "Null 값이 올 수 없습니다. 올바른 값인지 확인해주세요")
        String category,

//        @NotNull(message = "Null 값이 올 수 없습니다. 올바른 값인지 확인해주세요")
        int maxParticipants
) {
    public Community toEntity(Member member) {
        return Community
                .builder()
                .title(title)
                .content(content)
                .sessionStart(sessionStart)
                .deadline(deadline)
                .category(category)
                .maxParticipants(maxParticipants)
                .writer(member)
                .build();
    }

}
