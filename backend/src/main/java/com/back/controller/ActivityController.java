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
import java.util.List;


import java.util.Date;

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
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();

        if(pathInfo == null || pathInfo.equals("/")){
            getActivities(req, res);
        }else if(pathInfo.equals("/users")){
            getActivityUsers(req, res);
        }
    }

    private void getActivities(HttpServletRequest req, HttpServletResponse res) throws IOException {


        String sql = "SELECT * FROM activity";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            ResultSet rs = statement.executeQuery();
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();

            List<Map<String, Object>> activities = new ArrayList<>();

            if(rs.next()){

                Map<String, Object> row = new HashMap<>();
                for(int i = 1; i < columnCount; i++){
                    String columnName = metaData.getColumnName(i);
                    Object columnValue = rs.getObject(i);
                    row.put(columnName, columnValue);
                }
                activities.add(row);

            }

            objectMapper.writeValue(res.getWriter(), activities);
        } catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "Failed to fetch activities");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }

    private void getActivityUsers(HttpServletRequest req, HttpServletResponse res) throws IOException{
        UserActivityModel userActivityModel = objectMapper.readValue(req.getReader(), UserActivityModel.class);

        String sql = "SELECT * FROM useractivity WHERE activityId = ?";

        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, userActivityModel.getActivityId());

            ResultSet rs = statement.executeQuery();
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();

            List<Map<String, Object>> userActivities = new ArrayList<>();

            if(rs.next()){
                Map<String, Object> row = new HashMap<>();
                for(int i = 1; i < columnCount; i++){
                    String columnName = metaData.getColumnName(i);
                    Object columnValue = rs.getObject(i);
                    row.put(columnName, columnValue);
                }
                userActivities.add(row);
            }

            objectMapper.writeValue(res.getWriter(), userActivities);
        } catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "Failed to fetch user activities");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
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

        String checkActivity = "SELECT COUNT(*) FROM activity WHERE name = ?";
        String sql = "INSERT INTO activity (uid, name, description, accesscode, created_by, status) VALUES (?, ?, ?, ?, ?, ?)";
        try{

            try(PreparedStatement statementCheck = connection.prepareStatement(checkActivity)){
                statementCheck.setString(1, activity.getName());
                ResultSet rs = statementCheck.executeQuery();

                if(rs.next() && rs.getInt(1) > 0){
                    Map<String, Object> checkMap = new HashMap<>();
                    checkMap.put("status", "false");
                    checkMap.put("message", "activity-already-exist");
                    objectMapper.writeValue(res.getWriter(), checkMap);
                    return;
                }
            }

            if(activity.getName() == null || activity.getName().isEmpty()){
                Map<String, String> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-activity-name");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            if(activity.getDescription() == null || activity.getDescription().isEmpty()){
                Map<String, String> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-description");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            if(activity.getAccessCode() == 0){
                Map<String, String> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-access-code");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            try(PreparedStatement statement = connection.prepareStatement(sql)){    
                statement.setString(1, activity.getUid());
                statement.setString(2, activity.getName());
                statement.setString(3, activity.getDescription());
                statement.setInt(4, activity.getAccessCode());
                statement.setString(5, activity.getCreatedBy());
                statement.setString(6, activity.getStatus());
                statement.executeUpdate();

                Map<String, String> userUid = new HashMap<>();
                userUid.put("userUid", activity.getUserUid()); // Add userUid to the map

                Map<String, Object> userData = new HashMap<>();
                userData.put("userName", activity.getUserName());
                userData.put("email", activity.getEmail());


                System.out.println("The data here is --> " + objectMapper.writeValueAsString(userData));

                String token = jwtUtil.generateToken(objectMapper.writeValueAsString(userUid), userData); 

                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "true");
                responseMap.put("status", "activity-inserted");
                responseMap.put("token", token);
    
                objectMapper.writeValue(res.getWriter(), responseMap);
            }
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
        try{

            if(auth.getEmail() == null || auth.getEmail().equals("")){
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
                     String chechUser = "SELECT COUNT(*) FROM useractivity WHERE userId = ?";

                     try(PreparedStatement statementCheck = connection.prepareStatement(chechUserPending)){
                        statementCheck.setString(1, userActivityModel.getUserId());

                        ResultSet rsCheck = statementCheck.executeQuery();

                        if(rsCheck.next() && rsCheck.getInt(1) > 0){
                            Map<String, Object> checkMap = new HashMap<>();
                            checkMap.put("status", "false");
                            checkMap.put("message", "User-pending");
                            objectMapper.writeValue(res.getWriter(), checkMap);
                            return;                            
                        }
                     }


                     try(PreparedStatement statementCheckUser = connection.prepareStatement(chechUser)){
                        statementCheckUser.setString(1, userActivityModel.getUserId());

                        ResultSet rsCheck2 = statementCheckUser.executeQuery();

                        if(rsCheck2.next() && rsCheck2.getInt(1) > 0){
                            Map<String, Object> checkMap = new HashMap<>();
                            checkMap.put("status", "false");
                            checkMap.put("message", "User-exist");
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

    private void userAccess(HttpServletRequest req, HttpServletResponse res) throws IOException {

        String requestBody = req.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);

        ActivityModel activity = objectMapper.readValue(requestBody, ActivityModel.class);

        // String sql = "SELECT a.id AS activity_id, a.name AS activity_name, ua.uid AS user_uid, ua.status AS user_status, a.accesscode FROM activity a JOIN useractivity ua ON a.uid = ua.activityId WHERE a.accesscode = ? AND ua.uid = ?";
        String sql = "SELECT * FROM activity WHERE accesscode = ? ";
        try{

            if(activity.getAccessCode() == 0){
                if(activity.getAccessCode() == 0){
                    Map<String, String> checkMap = new HashMap<>();
                    checkMap.put("status", "false");
                    checkMap.put("message", "empty-access-code");
                    objectMapper.writeValue(res.getWriter(), checkMap);
                    return;
            }
            }

            try(PreparedStatement statement = connection.prepareStatement(sql)){
                statement.setInt(1, activity.getAccessCode());
                ResultSet rs = statement.executeQuery();
    
                if(rs.next()){
                    UserActivityModel userActivityModel = objectMapper.readValue(requestBody, UserActivityModel.class);
                    String sql2 = "SELECT * FROM useractivity WHERE userId = ? AND status = 'pending'";
                    try(PreparedStatement statement2 = connection.prepareStatement(sql2)){
                        statement2.setString(1, userActivityModel.getUserId());
                        ResultSet rs2 = statement2.executeQuery();
    
                        if(rs2.next()){
                            Map<String, Object> responseMap = new HashMap<>();
                            responseMap.put("status", "true");
                            responseMap.put("activity", rs.getString("name"));
                            responseMap.put("description", rs.getString("description"));
                            responseMap.put("user_id", rs2.getString("userId"));
                            objectMapper.writeValue(res.getWriter(), responseMap);
    
                        }
    
                    }
    
                }else {
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "false");
                    responseMap.put("message", "Invalide-user");
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }
    
    
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



    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {

        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();

        if(pathInfo == null || pathInfo.equals("/")){
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "no such path");
        }else if(pathInfo.equals("/get/user")){
            getUser(req, res);
        }

    }

    private void getUser(HttpServletRequest req, HttpServletResponse res) throws IOException {

        UserActivityModel userActivityModel = objectMapper.readValue(req.getReader(), UserActivityModel.class);

        String sql = "UPDATE useractivity SET status = 'true' WHERE userId = ? AND status = 'pending'";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, userActivityModel.getUserId());

            int rowUpdated = statement.executeUpdate();

            if(rowUpdated > 0){
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "true");
            responseMap.put("message", "user-access");
            objectMapper.writeValue(res.getWriter(), responseMap);

            }
        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "Failed to update data");
            responseMap.put("error", e.getMessage());

            objectMapper.writeValue(res.getWriter(), responseMap);


        }
    }
}
