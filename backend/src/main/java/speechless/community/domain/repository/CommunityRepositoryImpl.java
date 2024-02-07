package speechless.community.domain.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import speechless.community.domain.Community;
import speechless.community.domain.QCommunity;
import speechless.member.domain.Member;


import java.util.List;

@Repository
public class CommunityRepositoryImpl implements CustomCommunityRepository{
    private JPAQueryFactory queryFactory;

    @PersistenceContext
    private EntityManager em;

    @PostConstruct
    public void init() {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public List<Community> findCommunitiesWithCursor(Long cusor, int limit) {
        QCommunity community = QCommunity.community;
        BooleanExpression predicate = community.id.gt(0);
        if (cusor != null) {
            predicate = predicate.and(community.id.lt(cusor));
        }

        return queryFactory.selectFrom(community)
                .where(predicate)
                .orderBy(community.id.desc())
                .limit(limit + 1)
                .fetch();
    }



    @Override
    public List<Community> searchCommunities(String title, Member writer, String content, String category, Boolean recruiting, Integer maxParticipants, Long cursor, int limit) {
        return null;
    }
}
