package speechless.interview.domain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import speechless.interview.application.dto.response.InterviewInfoResponse;
import speechless.interview.domain.InterviewInfo;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InterviewInfoMapper {

    InterviewInfoMapper INSTANCE = Mappers.getMapper(InterviewInfoMapper.class);

    InterviewInfoResponse toResponse(InterviewInfo interviewInfo);

}
