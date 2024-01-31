package speechless.auth.infra.naver;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.auth.domain.OAuthClient;
import speechless.auth.domain.OAuthMemberInfoClient;
import speechless.auth.domain.OAuthTokenClient;
import speechless.member.domain.MemberType;

@Component
@RequiredArgsConstructor
public class NaverOAuthClient implements OAuthClient {
    private final OAuthTokenClient naverOAuthTokenClient;
    private final OAuthMemberInfoClient naverOAuthMemberInfoClient;
    @Override
    public OAuthMemberResponse request(String authCode, String redirectUri) {
        String accessToken = naverOAuthTokenClient.getAccessToken(authCode, redirectUri);
        return naverOAuthMemberInfoClient.getMember(accessToken);
    }

    @Override
    public MemberType getMemberType() {
        return MemberType.naver;
    }

}
