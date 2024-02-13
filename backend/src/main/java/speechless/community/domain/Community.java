package speechless.community.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import speechless.announcement.domain.Announcement;
import speechless.common.entity.BaseTimeEntity;
import speechless.community.dto.request.CreateCommunityRequest;
import speechless.member.domain.Member;

import java.util.Date;

import static lombok.AccessLevel.PROTECTED;
import static lombok.EqualsAndHashCode.Include;

@Entity
@Getter
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

    @Column(nullable = false, name = "category")
    private String category;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 1000, nullable = false)
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date deadline;

    @Temporal(TemporalType.TIMESTAMP)
    private Date sessionStart;

    private boolean isInvisible;

    private boolean isDeleted;

    @Column(nullable = false)
    private Long hit = 0L;

    private int maxParticipants;

    @PrePersist
    public void prePersist(){
        isInvisible = false;
        isDeleted = false;
    }

    public void updateCategory(String category) {
        this.category = category;
    }

    public void updateTitle(String title) {
        this.title = title;
    }

    public void updateContent(String content) {
        this.content = content;
    }

    public void updateDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public void updateSessionStart(Date sessionStart) {
        this.sessionStart = sessionStart;
    }

    public void increaseHit() {
        this.hit++;
    }

    public void updateMaxParticipants(int maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public void updateCommunity(CreateCommunityRequest request) {
        this.title = request.title();
        this.content = request.content();
        this.deadline = request.deadline();
        this.sessionStart = request.sessionStart();
        this.category = request.category();
        this.maxParticipants = request.maxParticipants();
    }

    @OneToMany(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Participant> participants = new ArrayList<>();

    @Builder.Default
    @OneToOne(mappedBy = "community", cascade = CascadeType.ALL, orphanRemoval = true)
    private Announcement announcement = new Announcement();
}
