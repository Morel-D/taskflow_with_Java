package com.back;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class App 
{
    public static void main( String[] args ) throws Exception {

        // Check database connetion before statring the server

        try{
            checkDatabaseConnection();
        }catch (SQLException e){
            System.err.println("Failed to connect to the database : "+ e.getMessage());
            return;
        }

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


    private static void checkDatabaseConnection() throws SQLException {
        String url = "jdbc:mysql://localhost:3306/taskflow";
        String username = "root";
        String password = "";

        // Attempt to connect to the database
        try(Connection connection = DriverManager.getConnection(url, username, password)){
            if(connection != null){
                System.out.println("Connecrted to the database");
            }else {
                throw new SQLException("Unable to connect to the database");
            }
        }
    }
}
