package speechless.statement.application.dto.response;

import java.util.List;

public record StatementListResponse(
    List<StatementResponse> statements,
    int currentPage,
    int totalPage,
    long totalCount
) {

}
