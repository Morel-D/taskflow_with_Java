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
            if("GET".equals(exchange.getRequestMethod())) {
                taskController.getTask(exchange);
            }else if("POST".equals(exchange.getRequestMethod())){
                taskController.createTask(exchange);
            }else{
                exchange.sendResponseHeaders(405, -1);
            }
        }));

        server.createContext("/task/upate",  (exchange) -> {
            if("PUT".equals(exchange.getRequestMethod())){
                taskController.updateTask(exchange);
            }else {
                exchange.sendResponseHeaders(401, -1);
            }
        });

        server.createContext("/task/delete", (exchange) -> {
            if("DELETE".equals(exchange.getRequestMethod())){
                taskController.deleteTask(exchange);
            }else {
                exchange.sendResponseHeaders(405, -1);
            }
        });

        // start server 
        server.start();
        System.out.println("Server started at port 8000");
    }
    
}
