package speechless.auth.domain;

import org.springframework.stereotype.Component;
import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.member.domain.MemberType;

import java.util.EnumMap;
import java.util.Map;
import java.util.Set;

@Component
public class OAuthClients {

    Map<MemberType, OAuthClient> values = new EnumMap<>(MemberType.class);

    public OAuthClients(Set<OAuthClient> clients) {
        clients.forEach(client -> values.put(client.getMemberType(), client));
    }

    public OAuthMemberResponse request(String authCode, String redirectUri, String provider) {
        MemberType memberType = MemberType.valueOf(provider);
        OAuthClient oAuthClient = values.get(memberType);
        return oAuthClient.request(authCode, redirectUri);
    }
}
