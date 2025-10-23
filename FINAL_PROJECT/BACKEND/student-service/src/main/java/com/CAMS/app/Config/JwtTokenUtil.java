package com.CAMS.app.Config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys; // Import Keys class
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key; // Import Key interface
import java.util.Date;

@Component
public class JwtTokenUtil {
    // Generate a secure, base64-encoded key.
    // THIS IS FOR DEMONSTRATION. In production, load this from environment variables or a secure vault.
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Generates a secure key for HS256

    // If you want a hardcoded string for development, it MUST be at least 32 characters (256 bits)
    // and ideally base64 encoded. Example (DO NOT USE IN PRODUCTION):
    // private final String SECRET_STRING = "thisIsAVeryLongAndSecureSecretKeyForJWTAuthentication";
    // private final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());


    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours validity
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256) // Use the generated Key object
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder() // Use parserBuilder() for newer JJWT versions
            .setSigningKey(SECRET_KEY) // Use the generated Key object
            .build() // Build the parser
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parserBuilder() // Use parserBuilder()
            .setSigningKey(SECRET_KEY) // Use the generated Key object
            .build() // Build the parser
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
        return expiration.before(new Date());
    }
}
