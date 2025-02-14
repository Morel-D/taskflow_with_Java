package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class TaskContoller extends HttpServlet {
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Connection connection;

    public TaskContoller(Connection connection){
        this.connection = connection;
    }

    public static String generateUuid(){
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }


    @Override
protected void doOptions(HttpServletRequest req, HttpServletResponse res) throws IOException {
    // Handle preflight requests
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.setStatus(HttpServletResponse.SC_OK);
}


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        int taskId;

        // Retrive all the data 
        if(pathInfo == null || pathInfo.equals("/")){
            String sql = "SELECT * FROM task ORDER BY dateof DESC";

            try(PreparedStatement statement = connection.prepareStatement(sql); 
                ResultSet rs = statement.executeQuery()){
                
                List<Map<String, Object>> tasks  = new ArrayList<>();

                while (rs.next()) {
                    Map<String, Object> task = new HashMap<>();
                    task.put("id", rs.getInt("id"));
                    task.put("uid", rs.getString("uid"));
                    task.put("activityId", rs.getString("activityId"));
                    task.put("ownerId", rs.getString("ownerId"));
                    task.put("title", rs.getString("title"));
                    task.put("description", rs.getString("description"));
                    task.put("category", rs.getString("category"));
                    task.put("status", rs.getString("status"));
                    task.put("dueDate", rs.getString("dueDate"));
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
        }else if(pathInfo.startsWith("/todo/")){
            String id = pathInfo.substring(6);
            fetchTodoTask(res, id);
        }else if(pathInfo.startsWith("/progress/")){
            String id = pathInfo.substring(10);
            fetchProgressTask(res, id);
        }else if(pathInfo.startsWith("/done/")){
            String id = pathInfo.substring(6);
            fetchDoneTask(res, id);
        }else if((pathInfo.startsWith("/get/active/collaborators/"))){
            String activityUid = pathInfo.substring(26);
            getActiveCollaborators(res, activityUid);
        }else {
            // Retrive single data by ID
            taskId = Integer.parseInt(pathInfo.substring(1).trim());
            String sql = "SELECT * FROM task WHERE id = ?";
            try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setInt(1, taskId);
            ResultSet rs = statement.executeQuery();
            

                if(rs.next()){
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("id", rs.getInt("id"));
                    responseMap.put("uid", rs.getString("uid"));
                    responseMap.put("activityId", rs.getString("activityId"));
                    responseMap.put("ownerId", rs.getString("ownerId"));
                    responseMap.put("title", rs.getString("title"));
                    responseMap.put("description", rs.getString("description"));
                    responseMap.put("category", rs.getString("category"));
                    responseMap.put("status", rs.getString("status"));
                    responseMap.put("dueDate", rs.getString("dueDate"));
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

    private void getActiveCollaborators(HttpServletResponse res, String uid) throws IOException 
    {
        String query = "SELECT u.*, ua.joinedAt AS joined, ua.status AS userActivityStatus FROM userActivity ua JOIN activity a ON a.uid = ua.activityId JOIN user u ON u.uid = ua.userId WHERE a.created_by = ? AND ua.status = 'true'";

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
            responseMap.put("message", "Failed to get collaborators");
            responseMap.put("error", e.getMessage());

            objectMapper.writeValue(res.getWriter(), responseMap);
            
        }
    }

    private void fetchTodoTask (HttpServletResponse res, String id) throws IOException {
        String sql = "SELECT * FROM task WHERE status = 'todo' AND activityId = ? ORDER BY dateof DESC";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, id);
            ResultSet rs = statement.executeQuery();

            List<Map<String, Object>> tasks = new ArrayList<>();

            while(rs.next()){
                Map<String, Object> task = new HashMap<>();
                task.put("id", rs.getInt("id"));
                task.put("uid", rs.getString("uid"));
                task.put("activityId", rs.getString("activityId"));
                task.put("ownerId", rs.getString("ownerId"));
                task.put("title", rs.getString("title"));
                task.put("description", rs.getString("description"));
                task.put("category", rs.getString("category"));
                task.put("status", rs.getString("status"));
                task.put("dueDate", rs.getString("dueDate"));
                task.put("dateof", rs.getString("dateof"));

                tasks.add(task);
                }

                Map<String, Object> repsoneMap = new HashMap<>();
                repsoneMap.put("status", "true");
                repsoneMap.put("data", tasks);

                objectMapper.writeValue(res.getWriter(), repsoneMap);


                // return all the task in a JSON array
                objectMapper.writeValue(res.getWriter(), tasks);

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

    private void fetchProgressTask (HttpServletResponse res, String id) throws IOException {
        String sql = "SELECT * FROM task WHERE status = 'progress' AND activityId = ? ORDER BY dateof DESC";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
        statement.setString(1, id);   
        ResultSet rs = statement.executeQuery();
        
            List<Map<String, Object>> tasks = new ArrayList<>();
            while(rs.next()){
                Map<String, Object> task = new HashMap<>();
                task.put("id", rs.getInt("id"));
                task.put("uid", rs.getString("uid"));
                task.put("activityId", rs.getString("activityId"));
                task.put("ownerId", rs.getString("ownerId"));
                task.put("title", rs.getString("title"));
                task.put("description", rs.getString("description"));
                task.put("category", rs.getString("category"));
                task.put("status", rs.getString("status"));
                task.put("dueDate", rs.getString("dueDate"));
                task.put("dateof", rs.getString("dateof"));

                tasks.add(task);
                }

                Map<String, Object> repsoneMap = new HashMap<>();
                repsoneMap.put("status", "true");
                repsoneMap.put("data", tasks);

                objectMapper.writeValue(res.getWriter(), repsoneMap);


                // return all the task in a JSON array
                objectMapper.writeValue(res.getWriter(), tasks);

        }catch (SQLException e) {
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();

            responseMap.put("status", "false");
            responseMap.put("message", "Failed to fetch data");
            responseMap.put("error", e.getMessage());

            objectMapper.writeValue(res.getWriter(), responseMap);
            
        }
    }

    private void fetchDoneTask (HttpServletResponse res, String id) throws IOException {
        String sql = "SELECT * FROM task WHERE status = 'done' AND activityId = ? ORDER BY dateof DESC";
        try(PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, id);   
            ResultSet rs = statement.executeQuery();
        
            List<Map<String, Object>> tasks = new ArrayList<>();
            while(rs.next()){
                Map<String, Object> task = new HashMap<>();
                task.put("id", rs.getInt("id"));
                task.put("uid", rs.getString("uid"));
                task.put("activityId", rs.getString("activityId"));
                task.put("ownerId", rs.getString("ownerId"));
                task.put("title", rs.getString("title"));
                task.put("description", rs.getString("description"));
                task.put("category", rs.getString("category"));
                task.put("status", rs.getString("status"));
                task.put("dueDate", rs.getString("dueDate"));
                task.put("dateof", rs.getString("dateof"));

                tasks.add(task);
                }

                Map<String, Object> repsoneMap = new HashMap<>();
                repsoneMap.put("status", "true");
                repsoneMap.put("data", tasks);

                objectMapper.writeValue(res.getWriter(), repsoneMap);


                // return all the task in a JSON array
                objectMapper.writeValue(res.getWriter(), tasks);

        }catch (SQLException e) {
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

        // Get the entire JSON object
        JsonNode rootNode = objectMapper.readTree(req.getReader());


        // Parse the JSON input into a TaskModel Object
        TaskModel task = objectMapper.treeToValue(rootNode, TaskModel.class);

        // Insert task into the database 
        String sql = "INSERT INTO task (uid, activityId, ownerId, title, description, category, status, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try(PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, task.getUid());
            statement.setString(2, task.getActivityId());
            statement.setString(3, task.getOwnerId());
            statement.setString(4, task.getTitle());
            statement.setString(5, task.getDescription());
            statement.setString(6, task.getCategory());
            statement.setString(7, task.getStatus());
            statement.setTimestamp(8, task.getDueDate());
            statement.executeUpdate();

            // Handle the assign ***********************
            JsonNode assignedNode = rootNode.get("assigned");

            System.out.print("The JSON --> "+ assignedNode);


            if(assignedNode != null && assignedNode.isArray()){
                List<AssignModel> assignments = objectMapper.readValue(assignedNode.toString(), new TypeReference<List<AssignModel>>() {});

                String sql2 = "INSERT INTO assign (uid, taskUid, userActivityUid, status) VALUES (?, ?, ?, ?)";
                try(PreparedStatement statement2 = connection.prepareStatement(sql2)){
                    
                    for(AssignModel assign : assignments){
                    statement2.setString(1, assign.getUid());
                    statement2.setString(2, assign.getTaskUid());
                    statement2.setString(3, assign.getUserActivityUid());
                    statement2.setString(4, assign.getStatus());
    
                    statement2.addBatch();
                    }
    
                    int[] rowInserted = statement2.executeBatch();
    
    
                    // Creating a JSON response 
                    Map<String, Object> responseMap = new HashMap<>();
                    responseMap.put("status", "true");
                    responseMap.put("message", "data-inserted");
                    responseMap.put("Data Inserted", rowInserted.length);
    
                    // Write the Json response
                    objectMapper.writeValue(res.getWriter(), responseMap);
    
                }catch (SQLException e) {
                    e.printStackTrace();
                    res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("status", "false");
                    errorResponse.put("message", "Batch insertion failed");
                    errorResponse.put("error", e.getMessage());
                
                    objectMapper.writeValue(res.getWriter(), errorResponse);
                }
    
            }


        }catch(SQLException e){
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            // Creating a JSON response 
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "data-not-inserted");
            responseMap.put("error", e.getMessage());

            // Write the Json response
            objectMapper.writeValue(res.getWriter(), responseMap);
        }



    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse res) throws IOException{
        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

        res.setContentType("application/json");

        System.out.print("The data here is : "+ res);

        String pathInfo = req.getPathInfo();
        // int taskId;
        
        if(pathInfo == null || pathInfo.equals("/")){
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            Map<String, String> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("message", "This task doesn't exist");

            objectMapper.writeValue(res.getWriter(), responseMap);
            return;
        }

        String taskId = pathInfo.substring(1);
        TaskModel task = objectMapper.readValue(req.getReader(), TaskModel.class);

        

        StringBuilder sql = new StringBuilder("UPDATE task SET ");
        List<Object> parameters = new ArrayList<>();
        if (task.getTitle() != null) {
            sql.append("title = ?, ");
            parameters.add(task.getTitle());
        }
        
        if (task.getDescription() != null) {
            sql.append("description = ?, ");
            parameters.add(task.getDescription());
        }
        
        if (task.getCategory() != null) {
            sql.append("category = ?, ");
            parameters.add(task.getCategory());
        }
        
        if (task.getStatus() != null) {
            sql.append("status = ?, ");
            parameters.add(task.getStatus());
        }
        
        if (task.getDueDate() != null) {
            sql.append("dueDate = ?, ");
            parameters.add(task.getDueDate());
        }
        
        // Remove the last comma and space
        if (parameters.isEmpty()) {
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("status", "false");
            errorMap.put("message", "no-update-data");
            objectMapper.writeValue(res.getWriter(), errorMap);
            return;
        }

        sql.setLength(sql.length() - 2); // Remove trailing comma
        sql.append(" WHERE uid = ?");
        parameters.add(taskId);

        try(PreparedStatement statement = connection.prepareStatement(sql.toString())){
            for (int i = 0; i < parameters.size(); i++) {
                statement.setObject(i + 1, parameters.get(i));
            }
        
            int rowsUpdated = statement.executeUpdate();
            Map<String, String> responseMap = new HashMap<>();
        
            if (rowsUpdated > 0) {
                responseMap.put("status", "true");
                responseMap.put("message", "data-updated");
            } else {
                responseMap.put("status", "false");
                responseMap.put("message", "This task doesn't exist");
            }
        
            objectMapper.writeValue(res.getWriter(), responseMap);
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

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setStatus(HttpServletResponse.SC_OK);

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
