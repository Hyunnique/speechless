package speechless.auth.application.dto;

import speechless.member.domain.Member;
import speechless.member.domain.MemberType;

public interface OAuthMemberResponse {
    String getEmail();

    String getNickName();

    String getPicture();

    Member toMember();

    MemberType getMemberType();
}
