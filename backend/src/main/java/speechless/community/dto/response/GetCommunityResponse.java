package speechless.community.dto.response;

import java.time.LocalDateTime;
import java.util.Date;
import speechless.community.domain.Community;

public record GetCommunityResponse(
    Long id,
    String writer,
    String category,
    String title,
    String content,
    Date sessionStart,
    Date deadline,
    LocalDateTime createdAt,
    Integer maxParticipants,
    Long hit
) {

    public static GetCommunityResponse from(Community community) {
        return new GetCommunityResponse(
            community.getId(),
            community.getWriter().getName(),
            community.getCategory(),
            community.getTitle(),
            community.getContent(),
            community.getSessionStart(),
            community.getDeadline(),
            community.getCreatedAt(),
            community.getMaxParticipants(),
            community.getHit()
        );
    }
}
