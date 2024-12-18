package com.back;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Base64;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.io.IOException;


public class JwtFilter implements Filter {

    public final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SECRET_KEY = Base64.getEncoder().encodeToString("taskFlow-private-grouptask-secret-key-256bits".getBytes());

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialisation if required
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) req;
        HttpServletResponse httpResponse = (HttpServletResponse) res;

        String authorizationHeader = httpRequest.getHeader("Authorization");

        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer")){
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Map<String, Object> tokenReponse = new HashMap<>();
            tokenReponse.put("status", "Unauthorized");
            tokenReponse.put("message", "Missing or invalide token");
            objectMapper.writeValue(res.getWriter(), tokenReponse);
            return;
        }

        String token = authorizationHeader.substring(7);
        System.out.println("Token : "+ token);
        try{

            Claims claims = Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody();

            System.out.println("UserID : "+ claims.getSubject());
            System.out.println("email : "+ claims.get("email"));
            System.out.println("userName : "+ claims.get("username"));



            httpRequest.setAttribute("userId", claims.getSubject());
            httpRequest.setAttribute("email", claims.get("email"));
            httpRequest.setAttribute("userName", claims.get("username"));

            chain.doFilter(req, res);
        }catch(SignatureException e){
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Map<String, Object> tokenReponse = new HashMap<>();
            tokenReponse.put("status", "Unauthorized");
            tokenReponse.put("message", "Invalid token signature");
            objectMapper.writeValue(res.getWriter(), tokenReponse);
            // httpResponse.getWriter().write("Unauthorized: Invalid token signature");
        }catch(Exception e){
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Map<String, Object> tokenReponse = new HashMap<>();
            tokenReponse.put("status", "Unauthorized");
            tokenReponse.put("message", "Token validation failed");
            objectMapper.writeValue(res.getWriter(), tokenReponse);
            // httpResponse.getWriter().write("Unauthorized: Token validation failed");          
        }
    }

    @Override
    public void destroy(){}
}
