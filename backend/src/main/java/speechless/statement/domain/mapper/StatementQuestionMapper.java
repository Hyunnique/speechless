package speechless.statement.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import speechless.statement.application.dto.request.StatementQuestionRequest;
import speechless.statement.application.dto.request.StatementQuestionUpdateRequest;
import speechless.statement.application.dto.response.StatementQuestionResponse;
import speechless.statement.domain.StatementQuestion;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StatementQuestionMapper {

    StatementQuestionMapper INSTANCE = Mappers.getMapper(StatementQuestionMapper.class);

    StatementQuestion toEntity(StatementQuestionRequest request);

    StatementQuestion toEntity(StatementQuestionUpdateRequest request);

    @Mapping(target = "statementId", source = "statement.id")
    StatementQuestionResponse toResponse(StatementQuestion question);

}
