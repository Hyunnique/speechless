package speechless.interview.application.dto.response;

import java.util.List;

public record InterviewListResponse(
    List<InterviewInfoResponse> interviewInfos,
    int currentPage,
    int totalPage,
    long totalCount) {

}
