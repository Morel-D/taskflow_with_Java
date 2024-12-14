package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.HashMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;



public class ActivityController extends HttpServlet {
    
    public final ObjectMapper objectMapper = new ObjectMapper();
    private final Connection connection;

    public ActivityController(Connection connection){
        this.connection = connection;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException{

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "true");
        responseMap.put("message", "Communication established");

        objectMapper.writeValue(res.getWriter(), responseMap);
    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException{
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();

        System.out.println("Hello -> "+ pathInfo);


        if(pathInfo == null || pathInfo.equals("/")){
            createActivity(req, res);
        }else if(pathInfo.equals("/user/add")){
            addUser(req, res);
        }else if(pathInfo.equals("/user/invite")){
            userAccess(req, res);
        }
    }


    private void createActivity(HttpServletRequest req, HttpServletResponse res) throws IOException {
    ActivityModel activity = objectMapper.readValue(req.getReader(), ActivityModel.class);

        String sql = "INSERT INTO activity (uid, name, description, accesscode, created_by, status) VALUES (?, ?, ?, ?, ?, ?)";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, activity.getUid());
            statement.setString(2, activity.getName());
            statement.setString(3, activity.getDescription());
            statement.setInt(4, activity.getAccessCode());
            statement.setString(5, activity.getCreatedBy());
            statement.setString(6, activity.getStatus());
            statement.executeUpdate();

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "true");
            responseMap.put("status", "actibity-inserted");

            objectMapper.writeValue(res.getWriter(), responseMap);
        }catch(SQLException e){
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "activity-not-created");
            responseMap.put("error", e.getMessage());

            // Write the Json response
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }

    private void addUser(HttpServletRequest req, HttpServletResponse res) throws IOException {
        // Read the request body once and store it
        String requestBody = req.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);
        
        AuthModel auth = objectMapper.readValue(requestBody, AuthModel.class);

        String sql = "SELECT * FROM user WHERE email = ?";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, auth.getEmail());

            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                
                UserActivityModel userActivityModel = objectMapper.readValue(requestBody, UserActivityModel.class);
                userActivityModel.setUserId(rs.getString("uid"));

                 String sql2 = "INSERT INTO useractivity (uid, userId, activityId, status) VALUES (?, ?, ?, ?)";

                 try(PreparedStatement statement2 = connection.prepareStatement(sql2)){
                    statement2.setString(1, userActivityModel.getUid());
                    statement2.setString(2, userActivityModel.getUserId());
                    statement2.setString(3, userActivityModel.getActivityId());
                    statement2.setString(4, userActivityModel.getStatus());

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

                responseMap.put("status", "false");
                responseMap.put("message", "no-user");
                objectMapper.writeValue(res.getWriter(), responseMap);
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

    private void userAccess(HttpServletRequest req, HttpServletResponse res) throws IOException {
        ActivityModel activity = objectMapper.readValue(req.getReader(), ActivityModel.class);

        // String sql = "SELECT a.id AS activity_id, a.name AS activity_name, ua.uid AS user_uid, ua.status AS user_status, a.accesscode FROM activity a JOIN useractivity ua ON a.uid = ua.activityId WHERE a.accesscode = ? AND ua.uid = ?";
        String sql = "SELECT * FROM activity WHERE accesscode = ? ";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setInt(1, activity.getAccessCode());
            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "true");
                responseMap.put("activity", rs.getString("name"));
                responseMap.put("message", "User-invited");
                objectMapper.writeValue(res.getWriter(), responseMap);

            }else {
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "false");
                responseMap.put("message", "Invalide-user");
                objectMapper.writeValue(res.getWriter(), responseMap);
            }


        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();

            responseMap.put("status", "false");
            responseMap.put("message", "Failed to invite");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }
}
