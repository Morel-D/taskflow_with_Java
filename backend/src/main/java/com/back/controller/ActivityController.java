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
            statement.setInt(5, activity.getCreatedBy());
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
        System.out.println("Hello");

        String requestBody = req.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);


        AuthModel auth = objectMapper.readValue(requestBody, AuthModel.class);
        // UserActivityModel userActivity = objectMapper.readValue(requestBody, UserActivityModel.class);


        String sql = "SELECT * FROM user WHERE email = ?";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, auth.getEmail());

            ResultSet rs = statement.executeQuery();

            System.out.print("Hello res -> "+ rs);

            if(rs.next()){
                Map<String, Object> responseMap = new HashMap<>();

                responseMap.put("id", rs.getInt("id"));
                responseMap.put("uid", rs.getString("uid"));
                responseMap.put("username", rs.getString("username"));
                responseMap.put("email", rs.getString("email"));
                responseMap.put("status", rs.getString("status"));
                objectMapper.writeValue(res.getWriter(), responseMap);
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
}
