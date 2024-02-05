package speechless.interview.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import speechless.interview.application.dto.response.InterviewQuestionResponse;
import speechless.interview.domain.InterviewQuestion;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InterviewQuestionMapper {

    InterviewQuestionMapper INSTANCE = Mappers.getMapper(InterviewQuestionMapper.class);

    InterviewQuestionResponse questionToResponse(InterviewQuestion question);

}
