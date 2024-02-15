package speechless.community.dto.response;

import java.time.LocalDateTime;
import java.util.Date;
import speechless.community.domain.Community;

public record GetParticipatedResponse(
        Long id,
        String writer,
        String category,
        String title,
        String content,
        Date sessionStart,
        Date deadline,
        LocalDateTime createdAt,
        Integer maxParticipants,
        Long hit,
        Integer currentParticipants,
        Boolean isParticipated
) {

    public static GetParticipatedResponse from(Community community, Integer currentParticipants, Boolean isParticipated) {
        return new GetParticipatedResponse(
                community.getId(),
                community.getWriter().getName(),
                community.getCategory(),
                community.getTitle(),
                community.getContent(),
                community.getSessionStart(),
                community.getDeadline(),
                community.getCreatedAt(),
                community.getMaxParticipants(),
                community.getHit(),
                currentParticipants,
                isParticipated
        );
    }
}
