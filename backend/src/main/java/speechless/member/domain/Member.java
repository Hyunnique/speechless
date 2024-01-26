package speechless.member.domain;

import jakarta.persistence.*;
import lombok.*;
import speechless.common.entity.BaseTimeEntity;

import static lombok.AccessLevel.PROTECTED;
import static lombok.EqualsAndHashCode.Include;

@Entity
@Getter
// 빌더패턴 추가 -> 순서에의해 생기거나 명시적이지 못한 생성자가 생기는 걸 방지
@Builder
@AllArgsConstructor
// 아무런 매개변수가 없는 생성자를 생성하되 다른 패키지에 소속된 클래스는 접근을 불허
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

}
