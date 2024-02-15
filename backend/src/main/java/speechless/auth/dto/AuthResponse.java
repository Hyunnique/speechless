package speechless.auth.dto;

import speechless.member.domain.Member;

public record AuthResponse (
        Long id,
        String name,
        String email,
        String profileImageUrl
){
    public static AuthResponse of(Member member){
        return new AuthResponse(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getProfile()
        );
    }
}
