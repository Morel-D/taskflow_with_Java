package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Map;
import java.util.HashMap;
import org.mindrot.jbcrypt.BCrypt;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

import java.util.Base64;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;


public class AuthController extends HttpServlet {
    private static final String SECRET_KEY = Base64.getEncoder().encodeToString("taskFlow-private-grouptask-secret-key-256bits".getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    private final Connection connection;
    public final ObjectMapper objectMapper;
    

    public AuthController(Connection connection){
        this.connection = connection;
        this.objectMapper =  new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }


    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);
        
        // Set response type
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();

        if(pathInfo.startsWith("/get/user/")){
            String uid = pathInfo.substring(10);
            getSingUser(uid, res);
        }
    }


    private void getSingUser(String userUid, HttpServletResponse res) throws IOException{
        String query = "SELECT * FROM user WHERE uid = ?";
        try(PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, userUid);
            ResultSet rs = statement.executeQuery();  
            
            Map<String, Object> userInfo = new HashMap<>();
            
            if(rs.next()){
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", rs.getString("id"));
                userData.put("uid", rs.getString("uid"));
                userData.put("username", rs.getString("username"));
                userData.put("email", rs.getString("email"));
                userData.put("id", rs.getString("id"));

                userInfo.put("status", "true");
                userInfo.put("data", userData);

                objectMapper.writeValue(res.getWriter(), userInfo);

    }

}        catch (SQLException e) {
    e.printStackTrace();
    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    Map<String, Object> responseMap = new HashMap<>();
    responseMap.put("status", "false");
    responseMap.put("message", "failed-to-get");
    responseMap.put("error", e.getMessage());
    objectMapper.writeValue(res.getWriter(), responseMap);
}

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

        // Set response type
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        AuthModel auth = objectMapper.readValue(req.getReader(), AuthModel.class);

        if(pathInfo == null || pathInfo.equals("/")){

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "path-incomplete");

            objectMapper.writeValue(res.getWriter(), responseMap);
        }else if(pathInfo.equals("/signup")){
           signInAuth(res, auth); 
        }else if(pathInfo.equals("/login")){
            loginAuth(res, auth);
        }
    }

    private void signInAuth(HttpServletResponse res, AuthModel auth) throws IOException {

        String hasshedPassword = BCrypt.hashpw(auth.getPassword(), BCrypt.gensalt());

        String checkEmail = "SELECT COUNT(*) FROM user WHERE email = ?";
        String sql = "INSERT INTO user (uid, username, email, password, status) VALUES(?, ?, ?, ?, ?)";
        try{

            try(PreparedStatement statementCheck = connection.prepareStatement(checkEmail)){
                statementCheck.setString(1, auth.getEmail());
                ResultSet rs = statementCheck.executeQuery();

                if(rs.next() && rs.getInt(1) > 0){
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    Map<String, Object> checkMap = new HashMap<>();
                    checkMap.put("status", "false");
                    checkMap.put("message", "email-already-registered");
                    objectMapper.writeValue(res.getWriter(), checkMap);
                    return;
                }
            }

            // check some concditions

            if(auth.getEmail() == null || auth.getEmail().isEmpty()){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-email");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            if(auth.getUsername() == null || auth.getUsername().isEmpty()){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-username");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            if(auth.getPassword() == null || auth.getPassword().isEmpty()){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-password");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            try(PreparedStatement statement = connection.prepareStatement(sql)){
    
                statement.setString(1, auth.getUid());
                statement.setString(2, auth.getUsername());
                statement.setString(3, auth.getEmail());
                statement.setString(4, hasshedPassword);
                statement.setString(5, auth.getStatus());
                statement.executeUpdate();

                Map<String, Object> userData = new HashMap<>();
                userData.put("uid", auth.getUid());
                userData.put("username", auth.getUsername());
                userData.put("email", auth.getEmail());
                userData.put("status", auth.getStatus());
    
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "true");
                responseMap.put("message", "user-inserted");
                responseMap.put("data", userData);
    
                objectMapper.writeValue(res.getWriter(), responseMap);
            }

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

            if(auth.getEmail() == null || auth.getEmail().isEmpty()){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> checkEmailMap = new HashMap<>();
                checkEmailMap.put("status", "false");
                checkEmailMap.put("message", "empty-email");
                objectMapper.writeValue(res.getWriter(), checkEmailMap);
                return;
            }

            statement.setString(1, auth.getEmail());

            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                String hashedPassword = rs.getString("password");
                boolean passwordMatch = BCrypt.checkpw(auth.getPassword(), hashedPassword);

                if(!passwordMatch){
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "false");
                    responseMap.put("message", "invalid-credentials");
                    objectMapper.writeValue(res.getWriter(), responseMap);
                    return;
                }

                Map<String, Object> userData = new HashMap<>();
                userData.put("id", rs.getInt("id"));
                userData.put("uid", rs.getString("uid"));
                userData.put("email", rs.getString("email"));
                userData.put("username", rs.getString("username"));
                userData.put("status", rs.getString("status"));
                userData.put("dateof", rs.getString("dateof"));




                // Handle some checks.................................

                // Check is the user activity exist 

                String checkUserActiviy = "SELECT * FROM useractivity WHERE userId = ?";

                try(PreparedStatement checkUserActivityStatement = connection.prepareStatement(checkUserActiviy)){
                    checkUserActivityStatement.setString(1, rs.getString("uid"));
                    ResultSet checkUserResultSet = checkUserActivityStatement.executeQuery();

                    if(checkUserResultSet.next()){

                        String status = checkUserResultSet.getString("status");

                        // Print the status to the terminal for debugging
                        System.out.println("Status retrieved from useractivity: " + status);

                        // Check if the userActivity is active

                        Map<String, Object> userActivityData = new HashMap<>();
                        userActivityData.put("id", checkUserResultSet.getInt("id"));
                        userActivityData.put("uid", checkUserResultSet.getString("uid"));
                        userActivityData.put("userId", checkUserResultSet.getString("userId"));
                        userActivityData.put("activityId", checkUserResultSet.getString("activityId"));
                        userActivityData.put("joinedAt", checkUserResultSet.getString("joinedAt"));
                        userActivityData.put("role", checkUserResultSet.getString("role"));
                        userActivityData.put("status", checkUserResultSet.getString("status"));





                            if(status.equals("true")){
                                if(passwordMatch){
                                    String token = Jwts.builder().setSubject(rs.getString("uid"))
                                                                .setIssuer("taskflow")
                                                                .setIssuedAt(new Date())
                                                                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                                                                .claim("username", rs.getString("username"))
                                                                .claim("email", rs.getString("email"))
                                                                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                                                                .compact();
                
                                    Map<String, Object> responseMap = new HashMap<>();

                                    responseMap.put("status", true);
                                    responseMap.put("user", userData);
                                    responseMap.put("userActivity", userActivityData);
                                    responseMap.put("token", token);
                                    objectMapper.writeValue(res.getWriter(), responseMap);
                                }
                            }else {
                                Map<String, Object> responseMap = new HashMap<>();
                                responseMap.put("status", true);
                                responseMap.put("message", "user-pending");
                                responseMap.put("user", userData);
                                objectMapper.writeValue(res.getWriter(), responseMap);
                            }


                    }else{

                        String checkActivity = "SELECT * FROM activity WHERE created_by = ?";

                        try(PreparedStatement activityStatement = connection.prepareStatement(checkActivity)){
                            activityStatement.setString(1, rs.getString("uid"));
                            ResultSet activityRs = activityStatement.executeQuery();
                            ResultSetMetaData metaData = activityRs.getMetaData();
                            int columnCount = metaData.getColumnCount();

                            if(activityRs.next()){

                                Map<String, Object> data = new HashMap<>();
                                data.put("id", activityRs.getString("id"));
                                data.put("uid", activityRs.getString("uid"));
                                data.put("accesscode", activityRs.getString("accesscode"));
                                data.put("dateof", activityRs.getDate("dateof"));
                                data.put("name", activityRs.getString("name"));
                                data.put("created_by", activityRs.getString("created_by"));
                                data.put("description", activityRs.getString("description"));
                                data.put("status", activityRs.getString("status"));

                                Map<String, Object> responseMap = new HashMap<>();
                                responseMap.put("status", true);
                                responseMap.put("message", "activity-present");
                                responseMap.put("activity", data);
                                responseMap.put("user", userData);
                                objectMapper.writeValue(res.getWriter(), responseMap);

                            }else{
                                
                                Map<String, Object> responseMap = new HashMap<>();
                                responseMap.put("status", true);
                                responseMap.put("message", "no-userActivity");
                                responseMap.put("user", userData);
                                objectMapper.writeValue(res.getWriter(), responseMap);
                            }
                        }catch(SQLException e){
                            e.printStackTrace();
                            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                            Map<String, Object> responseMap = new HashMap<>();
                
                            responseMap.put("status", "false");
                            responseMap.put("message", "failed-to-get");
                            responseMap.put("error", e.getMessage());
                            objectMapper.writeValue(res.getWriter(), responseMap);
                        }
                    }

                }catch(SQLException e){
                    e.printStackTrace();
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    Map<String, Object> responseMap = new HashMap<>();
        
                    responseMap.put("status", "false");
                    responseMap.put("message", "failed-to-get");
                    responseMap.put("error", e.getMessage());
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }

            }else{
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "false");
                responseMap.put("message", "invalid-credentials");
                objectMapper.writeValue(res.getWriter(), responseMap);
            }
        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();

            responseMap.put("status", "false");
            responseMap.put("message", "failed-to-get");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }


    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException{

        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

        res.setContentType("application/json");

        AuthModel auth = objectMapper.readValue(req.getReader(), AuthModel.class);

        String pathInfo = req.getPathInfo();

        if(pathInfo == null || pathInfo.equals("/")){
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "This user doesn't exist");
            return;
        }

        if(pathInfo.startsWith("/update/")){

            String authId = pathInfo.substring(8);  
            String sql = "UPDATE user SET username = ?, email = ?, password = ?, status = ? WHERE uid = ?";

            try(PreparedStatement statement = connection.prepareStatement(sql)){
                statement.setString(1, auth.getUsername());
                statement.setString(2, auth.getEmail());
                statement.setString(3, auth.getPassword());
                statement.setString(4, auth.getStatus());
                statement.setString(5, authId);

                String statusInfo = auth.getStatus();

                int rowsUpdated = statement.executeUpdate();
                Map<String, String> responseMap = new HashMap<>();

                if (rowsUpdated > 0) {
                    responseMap.put("status", "true");
                    responseMap.put("message", "user-update");
                } else {
                    res.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    responseMap.put("status", "false");
                    responseMap.put("message", "update-failed");
                }
                objectMapper.writeValue(res.getWriter(), responseMap);
                
            }catch (SQLException e) {
                e.printStackTrace();
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "false");
                errorResponse.put("message", "Database error");
                errorResponse.put("error", e.getMessage());
        
                objectMapper.writeValue(res.getWriter(), errorResponse);
            }

        }


    }
}
