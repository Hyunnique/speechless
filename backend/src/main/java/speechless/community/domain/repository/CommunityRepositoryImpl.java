package speechless.community.domain.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import speechless.community.domain.Community;
import speechless.community.domain.QCommunity;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
    public List<Community> findCommunitiesWithCursor(Long cursor, int limit) {
        QCommunity community = QCommunity.community;
        BooleanExpression predicate = community.id.gt(0);
        if (cursor != null) {
            predicate = predicate.and(community.id.lt(cursor));
        }

        return queryFactory.selectFrom(community)
                .where(predicate)
                .orderBy(community.id.desc())
                .limit(limit + 1)
                .fetch();
    }

    private BooleanExpression titleContains(String title) {
        return Optional.ofNullable(title)
                .filter(t -> !t.isEmpty())
                .map(QCommunity.community.title::containsIgnoreCase)
                .orElse(null);
    }

    private BooleanExpression writeEquals(String writerName) {
        return Optional.ofNullable(writerName)
                .map(QCommunity.community.writer.name::eq)
                .orElse(null);
    }

    private BooleanExpression contentContains(String content) {
        return Optional.ofNullable(content)
                .filter(c -> !c.isEmpty())
                .map(QCommunity.community.content::containsIgnoreCase)
                .orElse(null);
    }

    private BooleanExpression categoryEquals(String category) {
        return Optional.ofNullable(category)
                .filter(c -> !c.isEmpty())
                .map(QCommunity.community.category::eq)
                .orElse(null);
    }

    private BooleanExpression isRecruiting() {
        Date now = new Date();
        QCommunity community = QCommunity.community;
        return community.sessionStart.loe(now)
                .and(community.deadline.goe(now));
    }
    private BooleanExpression maxParticipantsEquals(Integer maxParticipants) {
        return Optional.ofNullable(maxParticipants)
                .filter(max -> max > 0)
                .map(QCommunity.community.maxParticipants::goe)
                .orElse(null);
    }



    @Override
    public List<Community> searchCommunities(String title, String writerName, String content, String category, Boolean recruiting, Integer maxParticipants, Long cursor, int limit) {
        QCommunity community = QCommunity.community;
        BooleanExpression predicate = community.isDeleted.isFalse();

        predicate = Optional.ofNullable(titleContains(title)).map(predicate::and).orElse(predicate);
        predicate = Optional.ofNullable(writeEquals(writerName)).map(predicate::and).orElse(predicate);
        predicate = Optional.ofNullable(contentContains(content)).map(predicate::and).orElse(predicate);
        predicate = Optional.ofNullable(categoryEquals(category)).map(predicate::and).orElse(predicate);

        if(recruiting != null && recruiting) {
            predicate = predicate.and(isRecruiting());
        }

        predicate = Optional.ofNullable(maxParticipantsEquals(maxParticipants)).map(predicate::and).orElse(predicate);

        if (cursor != null) {
            predicate = predicate.and(community.id.lt(cursor));
        }

        return queryFactory.selectFrom(community)
                .where(predicate)
                .orderBy(community.id.desc())
                .limit(limit + 1)
                .fetch();
    }


    public List<Community> findPopularCommunities() {
        QCommunity community = QCommunity.community;
        BooleanExpression predicate = community.isDeleted.isFalse()
                .and(isRecruiting());

        return queryFactory.selectFrom(community)
                .where(predicate)
                .orderBy(community.hit.desc(), community.id.desc())
                .limit(8)
                .fetch();
    }
}
