package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;


import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;

public class SessionController extends HttpServlet {

    public final ObjectMapper objectMapper;
    private final Connection connection;

    public SessionController(Connection connection){
        this.connection = connection;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) throws IOException{
        // Handle preflight requests
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);
    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException{
        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

        res.setContentType("application/json");
        
        String pathInfo = req.getPathInfo();

        System.out.print("Path Info --> "+ pathInfo);

         if(pathInfo.startsWith("/collaborators/")){
            String uid = pathInfo.substring(15);
            getCollaborators(uid, res);
         }

            else if(pathInfo == null || pathInfo.length() > 1){
            String activityId = pathInfo.substring(1);
            getActivityById(activityId, res);
        }
        else{
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("status", "false");
            errorMap.put("message", "url-not-found");
            objectMapper.writeValue(res.getWriter(), errorMap);
        }
    }


    private void getActivityById(String activityId, HttpServletResponse res) throws IOException{
        String query = "SELECT * FROM useractivity WHERE userId = ?";
        try(PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, activityId);
            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                Map<String, Object> userActivity = new HashMap<>();
                userActivity.put("id", rs.getString("id"));
                userActivity.put("uid", rs.getString("uid"));
                userActivity.put("userId", rs.getString("userId"));
                userActivity.put("activityId", rs.getString("activityId"));
                userActivity.put("joinedAt", rs.getString("joinedAt"));
                userActivity.put("role", rs.getString("role"));
                userActivity.put("status", rs.getString("status"));
                // Add other fields as needed
                if(rs.getString("status").equals("pending")){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "false");
                    responseMap.put("message", "auth-not-complete");
                    responseMap.put("action", "wipe");
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }else{
                    if(rs.getString("role").equals("collaborator")){
                        String query2 = "SELECT * FROM activity WHERE uid = ?";
                        try(PreparedStatement statement2 = connection.prepareStatement(query2)){
                            statement2.setString(1, rs.getString("activityId"));
                            ResultSet rs2 = statement2.executeQuery();
                            if(rs2.next()){
                                Map<String, Object> activity = new HashMap<>();
                                activity.put("id", rs2.getString("id"));
                                activity.put("uid", rs2.getString("uid"));
                                activity.put("userId", rs2.getString("userUid"));
                                activity.put("manager", rs2.getString("userName"));
                                activity.put("email", rs2.getString("email"));
                                activity.put("activity", rs2.getString("name"));
                                activity.put("description", rs2.getString("description"));
                                activity.put("status", rs2.getString("status"));
    
                                Map<String, Object> info = new HashMap<>();
                                info.put("status", "true");
                                info.put("role", rs.getString("role"));
                                info.put("user", userActivity);
                                info.put("activity", activity);
                                objectMapper.writeValue(res.getWriter(), info);
                            }
                        } 
                    } else if( rs.getString("role").equals("manager")){
                        String query3 = "SELECT * FROM activity WHERE uid = ?";
                        try(PreparedStatement statement3 = connection.prepareStatement(query3)){
                            statement3.setString(1, rs.getString("activityId"));
                            ResultSet rs3 = statement3.executeQuery();
                            if(rs3.next()){
                                Map<String, Object> activity = new HashMap<>();
                                activity.put("id", rs3.getString("id"));
                                activity.put("uid", rs3.getString("uid"));
                                activity.put("userId", rs3.getString("userUid"));
                                activity.put("manager", rs3.getString("userName"));
                                activity.put("email", rs3.getString("email"));
                                activity.put("activity", rs3.getString("name"));
                                activity.put("description", rs3.getString("description"));
                                activity.put("status", rs3.getString("status"));

                                String query4 = "SELECT u.*, ua.status AS userActivityStatus, u.status AS userStatus, ua.uid AS userActivityUid " +
                                "FROM user u " +
                                "JOIN useractivity ua ON u.uid = ua.userId " +
                                "JOIN activity a ON a.uid = ua.activityId " +
                                "WHERE a.uid = ? AND ua.role <> 'manager'";

                                try(PreparedStatement statement4 = connection.prepareStatement(query4)){
                                    statement4.setString(1, rs3.getString("uid"));
                                    ResultSet rs4 = statement4.executeQuery();

                                    List<Map<String, Object>> collaborators = new ArrayList<>();

                                    while(rs4.next()){
                                        Map<String, Object> collaborator = new HashMap<>();
                                        collaborator.put("id", rs4.getString("id"));
                                        collaborator.put("userActivityUid", rs4.getString("userActivityUid"));
                                        collaborator.put("username", rs4.getString("username"));
                                        collaborator.put("userStatus", rs4.getString("userStatus")); // Status from user table
                                        collaborator.put("userActivityStatus", rs4.getString("userActivityStatus")); 
                                        collaborators.add(collaborator);
                                    }



                                    Map<String, Object> info = new HashMap<>();
                                    info.put("status", "true");
                                    info.put("role", rs.getString("role"));
                                    info.put("user", userActivity);
                                    info.put("activity", activity);
                                    info.put("collaborators", collaborators);
                                    objectMapper.writeValue(res.getWriter(), info);
                                }
    

                            }
                        } 
                    }else{
                        Map<String, Object> info = new HashMap<>();
                        info.put("status", "true");
                        info.put("role", rs.getString("role"));
                        info.put("user", userActivity);
                        info.put("activity", null);
                        objectMapper.writeValue(res.getWriter(), info);
                    }
                }
            }else{
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> responseMap = new HashMap<>();
    
                responseMap.put("status", "false");
                responseMap.put("message", "user-no-exist");
                objectMapper.writeValue(res.getWriter(), responseMap);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "failed-to-fetch");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }

    }

    private void getCollaborators(String uid, HttpServletResponse res) throws IOException{
        String query = "SELECT u.*, ua.joinedAt AS joined, ua.status AS userActivityStatus FROM userActivity ua JOIN activity a ON a.uid = ua.activityId JOIN user u ON u.uid = ua.userId WHERE a.created_by = ?";
        try(PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, uid);
            ResultSet rs = statement.executeQuery();

            List<Map<String, Object>> collaborators = new ArrayList<>();

            while (rs.next()) {
                Map<String, Object> collaborator = new HashMap<>();
                collaborator.put("uid", rs.getString("uid"));
                collaborator.put("email", rs.getString("email"));
                collaborator.put("username", rs.getString("username"));
                collaborator.put("userStatus", rs.getString("status"));
                collaborator.put("invited", rs.getString("joined"));
                collaborator.put("status", rs.getString("userActivityStatus"));

                collaborators.add(collaborator);
            }

            Map<String, Object> repsoneMap = new HashMap<>();
            repsoneMap.put("status", "true");
            repsoneMap.put("data", collaborators);

            objectMapper.writeValue(res.getWriter(), repsoneMap);
        } catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();

            responseMap.put("status", "false");
            responseMap.put("message", "Failed to fetch data");
            responseMap.put("error", e.getMessage());

            objectMapper.writeValue(res.getWriter(), responseMap);
            
        }
    }



    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

        // Set response type
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();

        System.out.println("USER ACTIVITY PATH -> "+ pathInfo);


        if(pathInfo.equals("/user/add")){
            addUser(req, res);
        }
    }


    private void addUser(HttpServletRequest req, HttpServletResponse res) throws IOException {
        // Read the request body once and store it
        String requestBody = req.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
        
        AuthModel auth = objectMapper.readValue(requestBody, AuthModel.class);

        String sql = "SELECT * FROM user WHERE email = ?";
        try{

            if(auth.getEmail() == null || auth.getEmail().equals("")){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, Object> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-email");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            try(PreparedStatement statement = connection.prepareStatement(sql)){
                statement.setString(1, auth.getEmail());
    
                ResultSet rs = statement.executeQuery();
    
                if(rs.next()){
                    
                    UserActivityModel userActivityModel = objectMapper.readValue(requestBody, UserActivityModel.class);
                    userActivityModel.setUserId(rs.getString("uid"));
    
                     String sql2 = "INSERT INTO useractivity (uid, userId, activityId, role, status) VALUES (?, ?, ?, ?, ?)";
                     String chechUserPending = "SELECT COUNT(*) FROM useractivity WHERE userId = ? AND status = 'pending'";
                     String chechUser = "SELECT COUNT(*) FROM useractivity WHERE userId = ? AND activityId = ?";
                     String checkOutsideUser = "SELECT COUNT(*) FROM userActivity WHERE userId = ? AND activityId != ?";


                     try(PreparedStatement statementCheck = connection.prepareStatement(chechUserPending)){
                        statementCheck.setString(1, userActivityModel.getUserId());

                        ResultSet rsCheck = statementCheck.executeQuery();

                        if(rsCheck.next() && rsCheck.getInt(1) > 0){
                            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            Map<String, Object> checkMap = new HashMap<>();
                            checkMap.put("status", "false");
                            checkMap.put("message", "User-pending");
                            objectMapper.writeValue(res.getWriter(), checkMap);
                            return;                            
                        }
                     }catch(SQLException e){
                        res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        Map<String, Object> checkMap = new HashMap<>();
                        checkMap.put("status", "false");
                        checkMap.put("message", "Invalide-user");
                        objectMapper.writeValue(res.getWriter(), checkMap);
                    } 


                     try(PreparedStatement statementCheckUser = connection.prepareStatement(chechUser)){
                        statementCheckUser.setString(1, userActivityModel.getUserId());
                        statementCheckUser.setString(2, userActivityModel.getActivityId());

                        ResultSet rsCheck2 = statementCheckUser.executeQuery();

                        if(rsCheck2.next() && rsCheck2.getInt(1) > 0){
                            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            Map<String, Object> checkMap = new HashMap<>();
                            checkMap.put("status", "false");
                            checkMap.put("message", "User-exist");
                            objectMapper.writeValue(res.getWriter(), checkMap);
                            return;                            
                        }
                     }

                     try(PreparedStatement statementChecOutsidekUser = connection.prepareStatement(checkOutsideUser)){
                        statementChecOutsidekUser.setString(1, userActivityModel.getUserId());
                        statementChecOutsidekUser.setString(2, userActivityModel.getActivityId());

                        ResultSet rsCheck3 = statementChecOutsidekUser.executeQuery();

                        if(rsCheck3.next() && rsCheck3.getInt(1) > 0){
                            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            Map<String, Object> checkMap = new HashMap<>();
                            checkMap.put("status", "false");
                            checkMap.put("message", "User-unavailable");
                            objectMapper.writeValue(res.getWriter(), checkMap);
                            return;                            
                        }
                     }

    
                     try(PreparedStatement statement2 = connection.prepareStatement(sql2)){
                        statement2.setString(1, userActivityModel.getUid());
                        statement2.setString(2, userActivityModel.getUserId());
                        statement2.setString(3, userActivityModel.getActivityId());
                        statement2.setString(4, userActivityModel.getRole());
                        statement2.setString(5, userActivityModel.getStatus());
    
                        statement2.executeUpdate();
    
    
                        Map<String, String> responseMap = new HashMap<>();
                        responseMap.put("status", "true");
                        responseMap.put("message", "user-invited-created");
                        objectMapper.writeValue(res.getWriter(), responseMap);
                        
    
                     }catch(SQLException e){
                        e.printStackTrace();
                        res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        Map<String, Object> responseMap = new HashMap<>();
                        responseMap.put("status", "false");
                        responseMap.put("message", "Failed to insert");
                        responseMap.put("error", e.getMessage());
                        objectMapper.writeValue(res.getWriter(), responseMap);
                    } 
                    
                }else{
                    Map<String, Object> responseMap = new HashMap<>();
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    responseMap.put("status", "false");
                    responseMap.put("message", "no-user");
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }
            }

        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();

            responseMap.put("status", "false");
            responseMap.put("message", "Failed to insert");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }


}
