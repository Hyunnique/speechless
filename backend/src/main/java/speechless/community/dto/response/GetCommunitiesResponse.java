package speechless.community.dto.response;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import speechless.community.domain.Community;
import speechless.community.domain.repository.ParticipantRepository;

public record GetCommunitiesResponse(
    List<GetCommunityResponse> getCommunityResponses,
    Long nextCursor
) {

    public static GetCommunitiesResponse from(List<Community> communities, Long nextCursor, ParticipantRepository participantRepository) {
        List<GetCommunityResponse> communityResponses = communities.stream()
                .map(community -> {
                    Integer participantNumber = participantRepository.findAllByCommunity(community).orElse(new ArrayList<>()).size();
                    return GetCommunityResponse.from(community, participantNumber);
                })
                .collect(Collectors.toList());
        return new GetCommunitiesResponse(communityResponses, nextCursor);
    }
}
