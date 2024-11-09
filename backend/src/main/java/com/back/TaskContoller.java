package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class TaskContoller extends HttpServlet {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Connection connection;

    public TaskContoller(Connection connection){
        this.connection = connection;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        int taskId;

        // Retrive all the data 
        if(pathInfo == null || pathInfo.equals("/")){
            String sql = "SELECT * FROM task";

            try(PreparedStatement statement = connection.prepareStatement(sql); 
                ResultSet rs = statement.executeQuery()){
                
                List<Map<String, Object>> tasks  = new ArrayList<>();

                while (rs.next()) {
                    Map<String, Object> task = new HashMap<>();
                    task.put("id", rs.getInt("id"));
                    task.put("title", rs.getString("title"));
                    task.put("content", rs.getString("content"));
                    task.put("dateof", rs.getString("dateof"));

                    tasks.add(task);
                }

                Map<String, Object> repsoneMap = new HashMap<>();
                repsoneMap.put("status", "true");
                repsoneMap.put("data", tasks);

                objectMapper.writeValue(res.getWriter(), repsoneMap);


                // return all the task in a JSON array
                objectMapper.writeValue(res.getWriter(), tasks);
            }catch(SQLException e){
                e.printStackTrace();
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                Map<String, String> responseMap = new HashMap<>();

                responseMap.put("status", "false");
                responseMap.put("message", "Failed to fetch data");
                responseMap.put("error", e.getMessage());

                objectMapper.writeValue(res.getWriter(), responseMap);
            }
        }else {
            // Retrive single data by ID
            taskId = Integer.parseInt(pathInfo.substring(1).trim());
            String sql = "SELECT * FROM task WHERE id = ?";
            try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setInt(1, taskId);
            ResultSet rs = statement.executeQuery();
            

                if(rs.next()){
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "true");
                    responseMap.put("id", rs.getInt("id"));
                    responseMap.put("title", rs.getString("title"));
                    responseMap.put("content", rs.getString("content"));
                    responseMap.put("dateof", rs.getString("dateof"));
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }else{
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "false");
                    responseMap.put("message", "No record found");
                    objectMapper.writeValue(res.getWriter(), responseMap);
                }
                
            }catch(SQLException e){
                e.printStackTrace();
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                Map<String, String> responseMap = new HashMap<>();

                responseMap.put("status", "false");
                responseMap.put("message", "Failed to fetch data");
                responseMap.put("error", e.getMessage());

                objectMapper.writeValue(res.getWriter(), responseMap);
                
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("application/json");

        // Parse the JSON input into a TaskModel Object
        TaskModel task = objectMapper.readValue(req.getReader(), TaskModel.class);

        // Insert task into the database 
        String sql = "INSERT INTO task (title, content) VALUES (?, ?)";
        try(PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, task.getTitle());
            statement.setString(2, task.getContent());
            statement.executeUpdate();

            // Creating a JSON response 
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("staus", "true");
            responseMap.put("message", "Data has been inserted successfully");

            // Write the Json response
            objectMapper.writeValue(res.getWriter(), responseMap);

        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            // Creating a JSON response 
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("staus", "false");
            responseMap.put("message", "Failed to insert data");
            responseMap.put("error", e.getMessage());

            // Write the Json response
            objectMapper.writeValue(res.getWriter(), responseMap);
        }



    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException{
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        int taskId;
        
        if(pathInfo == null || pathInfo.equals("/")){
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "This task doesn't exist");

            objectMapper.writeValue(res.getWriter(), responseMap);
            return;
        }

        taskId = Integer.parseInt(pathInfo.substring(1));
        TaskModel task = objectMapper.readValue(req.getReader(), TaskModel.class);

        String sql = "UPDATE task SET title = ?, content = ? WHERE id = ?";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, task.getTitle());
            statement.setString(2, task.getContent());
            statement.setInt(3, taskId);

            int rowsUpdated = statement.executeUpdate();
            Map<String, String> responseMap = new HashMap<>();

            if(rowsUpdated > 0){
            statement.setString(1, task.getTitle());
            responseMap.put("status", "true");
            responseMap.put("message", "Successfully updated record : "+taskId);
            objectMapper.writeValue(res.getWriter(), responseMap);

            }else{
                responseMap.put("status", "false");
                responseMap.put("message", "This task doesn't exist");
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

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException{
        res.setContentType("application/json");


        // delete a task by id
        String pathInfo = req.getPathInfo();
        int taskId;

        if(pathInfo == null || pathInfo.equals("/")){
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "This task doesn't exist");
            return;
        }

        String sql = "DELETE FROM task WHERE id = ?";
        taskId = Integer.parseInt(pathInfo.substring(1));
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setInt(1, taskId);

            Map<String, String> responseMap = new HashMap<>();

            int rowsDeleted = statement.executeUpdate();
            if(rowsDeleted > 0){
                responseMap.put("status", "true");
                responseMap.put("message", "Message deleted successfully");
                objectMapper.writeValue(res.getWriter(), responseMap);
            } else {
                responseMap.put("status", "false");
                responseMap.put("message", "Task not found");
                objectMapper.writeValue(res.getWriter(), responseMap);

            }
        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "Task failed to be deleted");
            responseMap.put("error", e.getMessage());
            objectMapper.writeValue(res.getWriter(), responseMap);

        }

    }
    
}
