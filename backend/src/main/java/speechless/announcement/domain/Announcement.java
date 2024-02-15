package speechless.announcement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;
import speechless.common.entity.BaseTimeEntity;
import speechless.community.domain.Community;

@Entity
@DynamicUpdate
@Table(name = "announcement_info")
@Getter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Announcement extends BaseTimeEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, cascade=CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "community_id", referencedColumnName = "id")
  private Community community;

  @Column(name = "announcement_id", length = 30)
  private String announcementId;

  @Column(name = "topic", length = 30)
  private String topic;
}
