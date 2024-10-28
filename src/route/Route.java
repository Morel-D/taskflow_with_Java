package src.route;

import src.controller.Controller;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class Route {

    public void startServer() throws IOException {

        // Create server instance at port 8000
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        Controller taskController = new Controller();


        server.createContext("/task", (exchange -> {
            String method = exchange.getRequestMethod();
            String path = exchange.getRequestURI().getPath();
            String[] segments = path.split("/");
        
            System.out.println("The method is: " + method);
            System.out.println("The path is: " + path);
            System.out.println("The segments is: " + segments);

        
            if ("GET".equals(method)) {
                // Check if path has an ID (e.g., /task/{id})
                if (segments.length == 3 && !segments[2].isEmpty()) {
                    // ID is present, call method to get a single task
                    String id = segments[2];
                    taskController.getSingleTask(exchange, id);
                }else if(segments.length == 2){
                    taskController.getTask(exchange);
                }
            } else if("POST".equals(method)){
                taskController.createTask(exchange);
            } else if ("PUT".equals(method)){
                if(segments.length == 3 && !segments[2].isEmpty()){
                    String id = segments[2];
                    taskController.updateTask(exchange, id);
                }else {
                    exchange.sendResponseHeaders(400, -1);
                }
                
            } else if("DELETE".equals(method)){
                if(segments.length == 3 && !segments[2].isEmpty()){
                    String id = segments[2];
                    taskController.deleteTask(exchange, id);
                }
            } else {
                // Method Not Allowed
                exchange.sendResponseHeaders(405, -1);
            }
        }));

        // start server 
        server.start();
        System.out.println("Server started at port 8000");
    }
    
}
