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

        if(pathInfo == null || pathInfo.length() > 1){
            String activityId = pathInfo.substring(1);
            getActivityById(activityId, res);
        }else{
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
}
