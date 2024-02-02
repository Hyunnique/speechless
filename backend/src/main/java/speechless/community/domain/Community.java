package speechless.community.domain;

import jakarta.persistence.*;
import lombok.*;
import speechless.common.entity.BaseTimeEntity;
import speechless.member.domain.Member;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;
import static lombok.EqualsAndHashCode.Include;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Community extends BaseTimeEntity {
    @Id
    @Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(referencedColumnName = "id")
    private Member writer;

    @Column(nullable = false, name = "category_id")
    private String category;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 1000)
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Temporal(TemporalType.TIMESTAMP)
    private Date sessionStart;

    private boolean isInvisible;

    private boolean isPrivate;

    private boolean isDeleted;

    private Long hit;

    private int maxParticipants;

    @PrePersist
    public void prePersist(){
        isInvisible = false;
        isPrivate = false;
        isDeleted = false;
    }


    public void isPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }
}
