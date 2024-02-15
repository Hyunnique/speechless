package speechless.auth.domain;

import speechless.auth.application.dto.OAuthMemberResponse;

public interface OAuthMemberInfoClient {
    OAuthMemberResponse getMember(String accessToken);
}
