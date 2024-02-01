package speechless.statement.domain;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;
import speechless.common.entity.BaseTimeEntity;
import speechless.member.domain.Member;

@Entity
@DynamicUpdate
@Table(name = "statement")
@Getter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class Statement extends BaseTimeEntity {

    @Id
    @Basic
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Basic
    @Column(name = "title")
    private String title;

    @Basic
    @Column(name = "company")
    private String company;

    @Basic
    @Column(name = "position")
    private String position;

    @Column(name = "career")
    private int career;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "statement", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC ")
    @Builder.Default
    private List<StatementQuestion> questions = new ArrayList<>();

    public List<StatementQuestion> getQuestions() {
        return Collections.unmodifiableList(questions);
    }

    public void addQuestion(StatementQuestion question) {
        this.questions.add(question);
    }

    public Boolean isQuestionEmpty() {
        return questions == null || questions.isEmpty();
    }

}
