package src.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import com.sun.net.httpserver.HttpExchange;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Connection;


public class Controller {

    private Connection dbConnection;

    // Contructor to initialize taskController with the db connection
    public Controller(Connection connection){
        this.dbConnection = connection;
    }

    // GET REQUEST 
    public void getTask(HttpExchange exchange) throws IOException{
        String jsonResponse = "{\"message\": \"Hello World! GET /tasks\"}";
        sendReponse(exchange, jsonResponse);
    }


    // GET SINGLE REQUEST 
    public void getSingleTask(HttpExchange exchange, String id) throws IOException{
        String jsonResponse = "{\"id\": " + id + ", \"message\": \"Task details for ID " + id + "\"}";
        sendReponse(exchange, jsonResponse);
    }

    
    // POST REQUEST
    public void createTask(HttpExchange exchange) throws IOException{
        // Only process if the method is a POST
        if(!"POST".equals(exchange.getRequestMethod())){
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        // Read the request body for the task
        InputStream inputStream = exchange.getRequestBody();
        String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

        // Pasre the JSON data
        String title = "Morel";
        String content = "This is me";

        // Assume both are added...
        
        // database insertion
        try{
            String sql = "INSERT INTO task (title, content) VALUES (?, ?)";
            try(PreparedStatement statement = dbConnection.prepareStatement(sql)){
                statement.setString(1, title);
                statement.setString(2, content);
                statement.executeUpdate();
            }
            String response = "{\"message\": \"Task created successfully\"}";
            exchange.sendResponseHeaders(201, response.getBytes().length);
            exchange.getResponseBody().write(response.getBytes());
        }catch(SQLException e){
            e.printStackTrace();
            String errorResponse = "{\"error\": \"Failed to create task\"}";
            exchange.sendResponseHeaders(500, errorResponse.getBytes().length);
            exchange.getResponseBody().write(errorResponse.getBytes());
        }

    }


    // PUT REQUEST
    public void updateTask(HttpExchange exchange, String id) throws IOException{
        String jsonResponse = "{\"id\": " + id + ", \"message\": \"Task details for PUT Task " + id + "\"}";
        sendReponse(exchange, jsonResponse);
    }

    
    // DELETE REQUEST
    public void deleteTask(HttpExchange exchange, String id) throws IOException{
        String jsonResponse = "{\"message\": \"Hello World! DELETE /tasks\"}";
        sendReponse(exchange, jsonResponse);
    }

    

    private void sendReponse(HttpExchange exchange, String jsonResponse) throws IOException{
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
        OutputStream outputStream = exchange.getResponseBody();
        outputStream.write(jsonResponse.getBytes());
        outputStream.close();
    }
}
