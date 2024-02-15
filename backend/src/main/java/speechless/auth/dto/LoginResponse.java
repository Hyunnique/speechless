package speechless.auth.dto;

import speechless.member.domain.Member;

public record LoginResponse (
        String accessToken,
        String refreshToken,
        AuthResponse authResponse
){
    public static LoginResponse of(TokenDto tokenDto, Member member) {
        return new LoginResponse(
                tokenDto.accessToken(),
                tokenDto.refreshToken(),
                AuthResponse.of(member)
        );
    }
}