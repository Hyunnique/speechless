package speechless.statement.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import speechless.statement.application.dto.request.StatementRequest;
import speechless.statement.application.dto.response.StatementResponse;
import speechless.statement.domain.Statement;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StatementMapper {

    StatementMapper INSTANCE = Mappers.getMapper(StatementMapper.class);

    @Mapping(target = "questions", ignore = true)
    Statement toEntity(StatementRequest request);

    StatementResponse toResponse(Statement statement);

}
