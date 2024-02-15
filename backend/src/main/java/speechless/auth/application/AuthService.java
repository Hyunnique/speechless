package speechless.auth.application;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import speechless.auth.application.dto.OAuthMemberResponse;
import speechless.auth.domain.RefreshToken;
import speechless.auth.domain.repository.RefreshTokenRepository;
import speechless.auth.dto.TokenDto;
import speechless.auth.support.JwtProvider;
import speechless.member.domain.Member;
import speechless.member.domain.repository.MemberRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final JwtProvider jwtProvider;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public TokenDto login(OAuthMemberResponse oAuthMemberResponse) {
        Member member = memberRepository.findByEmailAndMemberType(oAuthMemberResponse.getEmail(), oAuthMemberResponse.getMemberType())
                .orElseGet(() -> memberRepository.save(oAuthMemberResponse.toMember()));
        return createTokens(member.getId());
    }

    private TokenDto createTokens(Long memberId) {
        String accessToken = jwtProvider.createAccessToken(memberId);
        String refreshToken = jwtProvider.createRefreshToken();

        refreshTokenRepository.deleteByMemberId(memberId);
        refreshTokenRepository.save(new RefreshToken(memberId, refreshToken));
        return TokenDto.of(accessToken, refreshToken);
    }

    public String renewAccessTokenBy(String refreshToken) {
        jwtProvider.validateParseJws(refreshToken);

        RefreshToken saveRefreshToken = refreshTokenRepository.getByToken(refreshToken);
        Long memberId = saveRefreshToken.getMemberId();

        return jwtProvider.createAccessToken(memberId);
    }

    public void logout(Long memberId){
        refreshTokenRepository.deleteByMemberId(memberId);

    }
}
