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



public class ActivityController extends HttpServlet {

    private static final String SECRET_KEY = Base64.getEncoder().encodeToString("taskFlow-private-grouptask-secret-key-256bits".getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;
    
    public final ObjectMapper objectMapper;
    private final Connection connection;

    public ActivityController(Connection connection){
        this.connection = connection;
        this.objectMapper = new ObjectMapper();
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


    // GET REQUEST****************************************************************************************************

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


    // POST REQUEST****************************************************************************************************

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException{

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);
        

        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();

        System.out.println("USER ACTIVITY PATH -> "+ pathInfo);


        if(pathInfo == null || pathInfo.equals("/")){
            createActivity(req, res);
        }else if(pathInfo.equals("/user/add")){
            addUser(req, res);
        }else if(pathInfo.equals("/user/invite")){
            userAccess(req, res);
        }else if(pathInfo.equals("/get")){
            getActivity(req, res);
        }else if(pathInfo.equals("/create/managerActivity")){
            managerUserActivity(req, res);
        }
    }

    private void managerUserActivity(HttpServletRequest req, HttpServletResponse res) throws IOException {
        UserActivityModel userActivityModel = objectMapper.readValue(req.getReader(), UserActivityModel.class);

        String sql = "INSERT INTO useractivity (uid, userId, activityId, role, status) VALUES (?, ?, ?, ?, ?)";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, userActivityModel.getUid());
            statement.setString(2, userActivityModel.getUserId());
            statement.setString(3, userActivityModel.getActivityId());
            statement.setString(4, userActivityModel.getRole());
            statement.setString(5, userActivityModel.getStatus());
            statement.execute();

            String sql2 = "SELECT * FROM user WHERE uid = ?";
            try(PreparedStatement statement2 = connection.prepareStatement(sql2)){
                statement2.setString(1, userActivityModel.getUserId());
                ResultSet rs = statement2.executeQuery();

                if(rs.next()){

                    String token = Jwts.builder().setSubject(rs.getString("uid"))
                    .setIssuer("taskflow")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .claim("username", rs.getString("username"))
                    .claim("email", rs.getString("email"))
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();


                    Map responseMap = new HashMap<>();
                    responseMap.put("status", "true");
                    responseMap.put("token", token);
                objectMapper.writeValue(res.getWriter(), responseMap);

                }
            } catch (SQLException e) {
                e.printStackTrace();
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "false");
                responseMap.put("message", "failed");
                responseMap.put("error", e.getMessage());
                objectMapper.writeValue(res.getWriter(), responseMap);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "failed");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);
        }
    }

    private void getActivity(HttpServletRequest req, HttpServletResponse res) throws IOException {
        ActivityModel activity = objectMapper.readValue(req.getReader(), ActivityModel.class);

        String getActivitySql = "SELECT * FROM activity WHERE uid = ?";
        try(PreparedStatement statement = connection.prepareStatement(getActivitySql)){
            statement.setString(1, activity.getUid());
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
                // Fetch collaborators from the useractivity table
                String getCollaboratorsSql = "SELECT * FROM useractivity WHERE activityId = ? AND status = 'true' AND role = 'collaborator'";

                try(PreparedStatement collStatement = connection.prepareStatement(getCollaboratorsSql)){
                    collStatement.setString(1, activity.getUid());
                    ResultSet collaboratorRs = collStatement.executeQuery();

                    List<Map<String, Object>> collaborators = new ArrayList<>();
                    while(collaboratorRs.next()) {

                        String getUser = "SELECT * FROM user WHERE uid = ?";
                        try(PreparedStatement userStatement = connection.prepareStatement(getUser)){
                            userStatement.setString(1, collaboratorRs.getString("userId"));
                            ResultSet userRs = userStatement.executeQuery();

                            while(userRs.next()) {  // Iterate through all users
                                Map<String, Object> collaborator = new HashMap<>();
                                collaborator.put("uid", userRs.getString("uid"));
                                collaborator.put("name", userRs.getString("username"));
                                collaborator.put("email", userRs.getString("email"));
                                // Add other fields as necessary
                        
                                collaborators.add(collaborator);
                            }

                        }
                    }

                    row.put("collaborators", collaborators);
                }

                // // Get the activity manager info

                // String activityManager = "SELECT * FROM user WHERE uid = ?";
                // try(PreparedStatement managerStatement = connection.prepareStatement(activityManager)){
                //     managerStatement.setString(1, rs.getString("created_by"));
                //     ResultSet managResultSet = managerStatement.executeQuery();

                //     if(managResultSet.next()){
                //         row.put("manager", managResultSet.getString("username"));
                //         row.put("email", managResultSet.getString("email"));
                //     }
                // }


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

    private void createActivity(HttpServletRequest req, HttpServletResponse res) throws IOException {
    ActivityModel activity = objectMapper.readValue(req.getReader(), ActivityModel.class);

        String checkActivity = "SELECT COUNT(*) FROM activity WHERE name = ?";
        String sql = "INSERT INTO activity (uid, userUid, userName, email, name, description, accesscode, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try{

            try(PreparedStatement statementCheck = connection.prepareStatement(checkActivity)){
                statementCheck.setString(1, activity.getName());
                ResultSet rs = statementCheck.executeQuery();

                if(rs.next() && rs.getInt(1) > 0){
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    Map<String, Object> checkMap = new HashMap<>();
                    checkMap.put("status", "false");
                    checkMap.put("message", "activity-already-exist");
                    objectMapper.writeValue(res.getWriter(), checkMap);
                    return;
                }
            }

            if(activity.getName() == null || activity.getName().isEmpty()){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, String> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-activity-name");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            if(activity.getDescription() == null || activity.getDescription().isEmpty()){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, String> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-description");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            if(activity.getAccessCode() == 0){
                res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                Map<String, String> checkMap = new HashMap<>();
                checkMap.put("status", "false");
                checkMap.put("message", "empty-access-code");
                objectMapper.writeValue(res.getWriter(), checkMap);
                return;
            }

            try(PreparedStatement statement = connection.prepareStatement(sql)){    
                statement.setString(1, activity.getUid());
                statement.setString(2, activity.getUserUid());
                statement.setString(3, activity.getUserName());
                statement.setString(4, activity.getEmail());
                statement.setString(5, activity.getName());
                statement.setString(6, activity.getDescription());
                statement.setInt(7, activity.getAccessCode());
                statement.setString(8, activity.getCreatedBy());
                statement.setString(9, activity.getStatus());
                statement.executeUpdate();

                Map<String, String> userUid = new HashMap<>();
                userUid.put("userUid", activity.getUserUid()); // Add userUid to the map

                Map<String, Object> userData = new HashMap<>();
                userData.put("userName", activity.getUserName());
                userData.put("email", activity.getEmail());


                Map<String, Object> companyData = new HashMap<>();
                companyData.put("uid", activity.getUid());
                companyData.put("name", activity.getName());
                companyData.put("description", activity.getDescription());
                companyData.put("created_by", activity.getCreatedBy());
                companyData.put("status", activity.getStatus());

                System.out.println("The data here is --> " + objectMapper.writeValueAsString(userData));

                String token = jwtUtil.generateToken(objectMapper.writeValueAsString(userUid), userData); 

                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("status", "true");
                responseMap.put("data", companyData);
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

    private void userAccess(HttpServletRequest req, HttpServletResponse res) throws IOException {

        String requestBody = req.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);

        ActivityModel activity = objectMapper.readValue(requestBody, ActivityModel.class);
        UserActivityModel userActivity = objectMapper.readValue(requestBody, UserActivityModel.class);

        // String sql = "SELECT a.id AS activity_id, a.name AS activity_name, ua.uid AS user_uid, ua.status AS user_status, a.accesscode FROM activity a JOIN useractivity ua ON a.uid = ua.activityId WHERE a.accesscode = ? AND ua.uid = ?";
        String sql = "SELECT a.* FROM activity a JOIN useractivity ua ON a.uid = ua.activityId WHERE a.accesscode = ? AND ua.userId = ?";
        try{

            if(activity.getAccessCode() == 0){
                if(activity.getAccessCode() == 0){
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    Map<String, String> checkMap = new HashMap<>();
                    checkMap.put("status", "false");
                    checkMap.put("message", "empty-access-code");
                    objectMapper.writeValue(res.getWriter(), checkMap);
                    return;
            }
            }

            try(PreparedStatement statement = connection.prepareStatement(sql)){
                statement.setInt(1, activity.getAccessCode());
                statement.setString(2, userActivity.getUserId());
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
                            responseMap.put("uid", rs.getString("uid"));
                            responseMap.put("activity", rs.getString("name"));
                            responseMap.put("description", rs.getString("description"));
                            responseMap.put("createdBy", rs.getString("created_by"));
                            responseMap.put("dateof", rs.getString("dateof"));
                            objectMapper.writeValue(res.getWriter(), responseMap);
    
                        }else{
                            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            Map<String, Object> responseMap = new HashMap<>();
                
                            responseMap.put("status", "false");
                            responseMap.put("message", "Invalide-user");
                            objectMapper.writeValue(res.getWriter(), responseMap);
                        }
    
                    }catch(SQLException e){
                        e.printStackTrace();
                        res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        Map<String, Object> responseMap = new HashMap<>();
            
                        responseMap.put("status", "false");
                        responseMap.put("message", "no-useractivity");
                        responseMap.put("error", e.getMessage());
                        objectMapper.writeValue(res.getWriter(), responseMap);
                    }
    
                }else {
                    res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
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


    // PUT REQUEST****************************************************************************************************


    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException {

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

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

            String userSql = "SELECT * FROM user WHERE uid = ?";

            try(PreparedStatement userStatement = connection.prepareStatement(userSql)){
                userStatement.setString(1, userActivityModel.getUserId());
                ResultSet userResultSet = userStatement.executeQuery();

                if(userResultSet.next()){

                    String token = Jwts.builder().setSubject(userResultSet.getString("uid"))
                    .setIssuer("taskflow")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                    .claim("username", userResultSet.getString("username"))
                    .claim("email", userResultSet.getString("email"))
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .compact();


                    Map<String, String> responseMap = new HashMap<>();
                    responseMap.put("status", "true");
                    responseMap.put("message", "user-access");
                    responseMap.put("token", token);
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }
            }

            }else{
                Map<String, String> responseMap = new HashMap<>();
                responseMap.put("status", "false");
                responseMap.put("message", "no-such-user");
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
