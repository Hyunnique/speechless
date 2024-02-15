package speechless.community.domain.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import speechless.community.domain.QParticipant;

@Repository
public class CustomParticipantRepositoryImpl implements CustomParticipantRepository{

    private JPAQueryFactory queryFactory;

    @PersistenceContext
    private EntityManager em;

    @PostConstruct
    public void init() {
        this.queryFactory = new JPAQueryFactory(em);
    }
    @Override
    public boolean existsByCommunityIdAndMemberId(Long communityId, Long memberId) {
        QParticipant participant = QParticipant.participant;

        Integer fetchOne = queryFactory
                .selectOne()
                .from(participant)
                .where(participant.community.id.eq(communityId)
                        .and(participant.member.id.eq(memberId)))
                .fetchFirst();
        return fetchOne != null;
    }

}
