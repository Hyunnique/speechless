package speechless.community.dto.response;

import speechless.community.domain.Community;

import java.util.List;
import java.util.stream.Collectors;

public record GetCommunitiesResponse(
        List<GetCommunityResponse> getCommunityResponses,
        Long nextCursor

) {
    public static GetCommunitiesResponse from(List<Community> communities, Long nextCursor) {
        return new GetCommunitiesResponse(communities.stream()
                .map(GetCommunityResponse::from)
                .collect(Collectors.toList())
                ,nextCursor
        );
    }
}
