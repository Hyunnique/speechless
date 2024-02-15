package speechless.auth.domain;

import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.member.domain.MemberType;

public interface OAuthClient {
    OAuthMemberResponse request(String authCode, String redirectUri);

    MemberType getMemberType();
}
