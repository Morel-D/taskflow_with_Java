package com.back;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.servlet.FilterHolder;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class App 
{
    public static void main( String[] args ) throws Exception {
        Connection connection = null;

            // Check database connetion before statring the server
            String url = "jdbc:mysql://localhost:3306/taskflow";
            String username = "root";
            String password = "";

            // Attempt to connect to the database
            try {
                connection = DriverManager.getConnection(url, username, password);
                if(connection != null){
                    System.out.println("Connecrted to the database");
                }else {
                    throw new SQLException("Unable to connect to the database");
                }
            }catch (SQLException e) {
                System.err.println("Failed to connect to the database: " + e.getMessage());
                return; // Exit if the database connection fails
            }

        Server server = new Server(8080);

        ServletContextHandler handler = new ServletContextHandler();
        handler.setContextPath("/");

        FilterHolder jwtFilterHolder = new FilterHolder(new JwtFilter());
        handler.addFilter(jwtFilterHolder, "/protected/*", null);


        // Add the routes (servlets) to the handler
        handler.addServlet(new ServletHolder(new SessionController(connection)), "/protected/*");
        handler.addServlet(new ServletHolder(new TaskContoller(connection)), "/protected/task/*");
        handler.addServlet(new ServletHolder(new AuthController(connection)), "/auth/*");
        handler.addServlet(new ServletHolder(new ActivityController(connection)), "/activity/*");


        // Set the handler to the server 
        server.setHandler(handler);

        server.start();
        System.out.println("Server running on port 8080");
        server.join();

    }

}
