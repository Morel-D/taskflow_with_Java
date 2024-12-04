package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.HashMap;
import org.mindrot.jbcrypt.BCrypt;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class AuthController extends HttpServlet {
    public final ObjectMapper objectMapper = new ObjectMapper();
    private static final String SECRET_KEY = "your-scret-key";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    private final Connection connection;

    public AuthController(Connection connection){
        this.connection = connection;
    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {

        // Set response type
        res.setContentType("application/json");

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("Status", "true");
        responseMap.put("message", "This is the response for sure");

        objectMapper.writeValue(res.getWriter(), responseMap);
    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        
        // Set response type
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        AuthModel auth = objectMapper.readValue(req.getReader(), AuthModel.class);

        if(pathInfo == null || pathInfo.equals("/")){

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("error", "path-incomplete");

            objectMapper.writeValue(res.getWriter(), responseMap);
        }else if(pathInfo.equals("/signup")){
           signInAuth(res, auth); 
        }else if(pathInfo.equals("/login")){
            loginAuth(res, auth);
        }
    }


    private void signInAuth(HttpServletResponse res, AuthModel auth) throws IOException {

        String hasshedPassword = BCrypt.hashpw(auth.getPassword(), BCrypt.gensalt());

        String sql = "INSERT INTO user (uid, username, email, password, status) VALUES(?, ?, ?, ?, ?)";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, auth.getUid());
            statement.setString(2, auth.getUsername());
            statement.setString(3, auth.getEmail());
            statement.setString(4, hasshedPassword);
            statement.setString(5, auth.getStatus());
            statement.executeUpdate();

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "true");
            responseMap.put("message", "user-inserted");

            objectMapper.writeValue(res.getWriter(), responseMap);
        }catch(SQLException e){
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "user-not-created");
            responseMap.put("error", e.getMessage());

            // Write the Json response
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }
    
    private void loginAuth(HttpServletResponse res, AuthModel auth) throws IOException {
        String sql = "SELECT * FROM user WHERE email = ?";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, auth.getEmail());

            ResultSet rs = statement.executeQuery();

            if(rs.next()){

                String hashedPassword = rs.getString("password");
                boolean passwordMatch = BCrypt.checkpw(auth.getPassword(), hashedPassword);

                if(passwordMatch){
                    String token = Jwts.builder().setSubject(rs.getString("uid"))
                                                 .setIssuer("taskflow")
                                                 .setIssuedAt(new Date())
                                                 .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                                                 .claim("username", rs.getString("username"))
                                                 .claim("email", rs.getString("email"))
                                                //  .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                                                 .compact();

                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("id", rs.getInt("id"));
                    responseMap.put("uid", rs.getString("uid"));
                    responseMap.put("email", rs.getString("email"));
                    responseMap.put("username", rs.getString("username"));
                    responseMap.put("status", rs.getString("status"));
                    responseMap.put("dateof", rs.getString("dateof"));
                    responseMap.put("token", token);
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }else{
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "false");
                    responseMap.put("message", "Invalid credentials");
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }
            }else{
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "false");
                responseMap.put("message", "No-user");
                objectMapper.writeValue(res.getWriter(), responseMap);
            }
        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();

            responseMap.put("status", "false");
            responseMap.put("message", "Failed to get");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }
}
