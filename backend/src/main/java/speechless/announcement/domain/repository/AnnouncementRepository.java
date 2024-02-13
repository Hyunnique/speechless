package speechless.announcement.domain.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import speechless.announcement.domain.Announcement;
import speechless.community.domain.Community;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

  Optional<Announcement> findByCommunity(Community community);
  Optional<Announcement> findByAnnouncementId(String announcementId);
}
