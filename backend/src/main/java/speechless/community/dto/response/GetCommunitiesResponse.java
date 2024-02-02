package speechless.community.dto.response;

import speechless.community.domain.Community;

import java.util.List;
import java.util.stream.Collectors;

public record GetCommunitiesResponse(
        List<GetCommunityResponse> getCommunityResponses

) {
    public static GetCommunitiesResponse from(List<Community> communities) {
        return new GetCommunitiesResponse(communities.stream()
                .map(GetCommunityResponse::from)
                .collect(Collectors.toList()));
    }
}
