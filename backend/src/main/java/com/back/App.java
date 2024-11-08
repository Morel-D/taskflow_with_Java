package com.back;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;

public class App 
{
    public static void main( String[] args ) throws Exception {
        Server server = new Server(8080);

        ServletContextHandler handler = new ServletContextHandler();
        handler.setContextPath("/");

        // Add the routes (servlets) to the handler
        handler.addServlet(TaskContoller.class, "/task");

        // Set the handler to the server 
        server.setHandler(handler);

        server.start();
        System.out.println("Server running on port 8080");
        server.join();

    }
}
