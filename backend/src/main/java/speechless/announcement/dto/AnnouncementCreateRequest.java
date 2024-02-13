package speechless.announcement.dto;

public record AnnouncementCreateRequest (
  String topic,
  Long communityId
){

}
