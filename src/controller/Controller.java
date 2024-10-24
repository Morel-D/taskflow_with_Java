package src.controller;

import java.io.IOException;
import java.io.OutputStream;
import com.sun.net.httpserver.HttpExchange;

public class Controller {

    // GET REQUEST 
    public void getTask(HttpExchange exchange) throws IOException{
        String jsonResponse = "{\"message\": \"Hello World! GET /tasks\"}";
        sendReponse(exchange, jsonResponse);
    }

    
    // POSR REQUEST
    public void createTask(HttpExchange exchange) throws IOException{
        String jsonResponse = "{\"message\": \"Hello World! POST /tasks\"}";
        sendReponse(exchange, jsonResponse);
    }


    // PUT REQUEST
    public void updateTask(HttpExchange exchange) throws IOException{
        String jsonResponse = "{\"message\": \"Hello World! PUT /tasks\"}";
        sendReponse(exchange, jsonResponse);
    }

    
    // DELETE REQUEST
    public void deleteTask(HttpExchange exchange) throws IOException{
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
