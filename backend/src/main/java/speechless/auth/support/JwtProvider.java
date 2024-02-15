package speechless.auth.support;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import speechless.auth.exception.TokenExpiredException;
import speechless.auth.exception.TokenInvalidException;
import speechless.common.config.JwtCredentials;

import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import javax.xml.crypto.Data;

import static io.jsonwebtoken.security.Keys.hmacShaKeyFor;
import static java.nio.charset.StandardCharsets.UTF_8;

@Component
public class JwtProvider {
    private final SecretKey key;
    private final long accessTokenExpirationTime;
    private final long refreshTokenExpirationTime;

    public JwtProvider(JwtCredentials jwtCredentials) {
        this.key = hmacShaKeyFor(jwtCredentials.getSecretKey().getBytes(UTF_8));
        this.accessTokenExpirationTime = jwtCredentials.getAccessTokenExpirationTime();
        this.refreshTokenExpirationTime = jwtCredentials.getRefreshTokenExpirationTime();
    }

    public String createAccessToken(Long memberId) {
        return createToken(memberId.toString(), accessTokenExpirationTime, key);
    }

    private String createToken(String payload, long expireLength, SecretKey key) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expireLength);
        return Jwts.builder().setSubject(payload).setIssuedAt(now).setExpiration(expiration).signWith(key, SignatureAlgorithm.HS256).compact();
    }

    public String createRefreshToken(){
        return createToken(UUID.randomUUID().toString(), refreshTokenExpirationTime, key);
    }

    public String getPayload(String token) {
        return validateParseJws(token).getBody().getSubject();
    }

    public Jws<Claims> validateParseJws(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException();
        } catch (JwtException e) {
            throw new TokenInvalidException();
        }
    }
}
