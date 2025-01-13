package com.back;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.security.Signature;
import java.util.Base64;
import java.util.Map;


public class jwtUtil {
    private static final String SECRETE_KEY = Base64.getEncoder().encodeToString("taskFlow-private-grouptask-secret-key-256bits".getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    public static String generateToken(String subject, Map<String, Object> claims){
        return Jwts.builder()
        .setSubject(subject) // UserId
        .setIssuer("taskflow")
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .addClaims(claims)
        .signWith(SignatureAlgorithm.HS256, SECRETE_KEY)
        .compact();
    }
}
