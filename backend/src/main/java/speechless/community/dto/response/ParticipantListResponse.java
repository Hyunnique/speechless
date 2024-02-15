package speechless.community.dto.response;

import java.util.List;
import speechless.interview.application.dto.response.InterviewInfoResponse;

public record ParticipantListResponse (
    List<ParticipantCommunityResponse> participants,
    int currentPage,
    int totalPage,
    long totalCount
){

}
