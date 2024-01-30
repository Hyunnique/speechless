package speechless.auth.infra.naver.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.member.domain.Member;
import speechless.member.domain.MemberType;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverMemberResponse implements OAuthMemberResponse {

    @JsonProperty("response")
    private NaverAcount naverAcount;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NaverAcount{
        private String email;
        private String nickname;
        @JsonProperty("profile_image")
        private String picture;
    }

    @Override
    public String getEmail() {
        return naverAcount.getEmail();
    }

    @Override
    public String getNickName() {
        return naverAcount.getNickname();
    }

    @Override
    public String getPicture() {
        return naverAcount.getPicture();
    }

    @Override
    public Member toMember() {
        return Member.builder().name(getNickName()).email(getEmail()).profile(getPicture()).build();
    }

    @Override
    public MemberType getMemberType() {
        return MemberType.naver;
    }
}
