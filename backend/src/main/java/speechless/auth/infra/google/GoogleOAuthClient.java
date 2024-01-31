package speechless.auth.infra.google;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.auth.domain.OAuthClient;
import speechless.auth.domain.OAuthMemberInfoClient;
import speechless.auth.domain.OAuthTokenClient;
import speechless.member.domain.MemberType;

@Component
@RequiredArgsConstructor
public class GoogleOAuthClient implements OAuthClient {
    private final OAuthTokenClient googleOAuthTokenClient;
    private final OAuthMemberInfoClient googleOAuthMemberInfoClient;

    @Override
    public OAuthMemberResponse request(String authCode, String redirectUri) {
        String accessToken = googleOAuthTokenClient.getAccessToken(authCode, redirectUri);
        return googleOAuthMemberInfoClient.getMember(accessToken);
    }

    @Override
    public MemberType getMemberType() {
        return MemberType.google;
    }
}
