package speechless.auth.infra.naver;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.auth.domain.OAuthClient;
import speechless.member.domain.MemberType;

@Component
@RequiredArgsConstructor
public class NaverOAuthClient implements OAuthClient {
    @Override
    public OAuthMemberResponse request(String authCode, String redirectUri) {
        return null;
    }

    @Override
    public MemberType getMemberType() {
        return MemberType.naver;
    }

}
