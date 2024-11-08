package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
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

        String id = req.getParameter("id");
        
        // Creating a JSON response 
        Map<String, String> responseMap = new HashMap<>();
        if(id != null){
            responseMap.put("Status", "true");
            responseMap.put("Message", "GET single data successfully");
        }else {
            responseMap.put("Status", "true");
            responseMap.put("Message", "GET all data successfully");
        }

        // Write the Json response
        objectMapper.writeValue(res.getWriter(), responseMap);
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

        String id = req.getParameter("id");

        // Creating a JSON response 
        Map<String, String> responseMap = new HashMap<>();
        if(id != null){
            responseMap.put("Status", "true");
            responseMap.put("Message", "PUT data successfully");
        }else{
            responseMap.put("Status", "false");
            responseMap.put("Message", "Provide a valide ID");
        }

        // Write the Json response
        objectMapper.writeValue(res.getWriter(), responseMap);

    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws IOException{
        res.setContentType("application/json");


        // delete a task by id
        String id = req.getParameter("id");

        // Creating a JSON response 
        Map<String, String> responseMap = new HashMap<>();
        if(id != null){
            responseMap.put("Status", "true");
            responseMap.put("Message", "Delete data successfully with ID : "+id);
        }else {
            responseMap.put("Status", "false");
            responseMap.put("Message", "Provide a valide ID");
        }

        // Write the Json response
        objectMapper.writeValue(res.getWriter(), responseMap);

    }
    
}
