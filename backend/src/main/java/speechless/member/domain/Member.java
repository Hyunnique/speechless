package speechless.member.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.*;
import speechless.common.entity.BaseTimeEntity;
import speechless.community.domain.Community;

import java.util.List;
import speechless.community.domain.Participant;
import speechless.interview.domain.InterviewInfo;
import speechless.statement.domain.Statement;

import static lombok.AccessLevel.PROTECTED;
import static lombok.EqualsAndHashCode.Include;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Member extends BaseTimeEntity {
    @Id
    @Include
    // pk값인 id값으로 추후 비교를 위한 Include 어노테이션
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String profile;

    @Enumerated(EnumType.STRING)
    private MemberType memberType;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY,
        cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Statement> statements = new ArrayList<>();

    public List<Statement> getStatement() {
        return Collections.unmodifiableList(statements);
    }

    // 연관관계 편의 메소드
    public void addStatement(Statement statement) {
        this.statements.add(statement);
        statement.setMember(this);
    }
    @OneToMany(mappedBy = "writer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Community> communities;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InterviewInfo> interviews = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private  List<Participant> participants = new ArrayList<>();
}
