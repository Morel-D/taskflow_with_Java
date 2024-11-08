package src;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import src.route.Route;

public class App {

    static final String JDBC_URL = "jdbc:mysql://localhost:3306/taskflow";
    static final String USERNAME  = "root";
    static final String PASSWORD = "";
    public static void main(String[] args) {
        Route route = new Route();
        Connection connection = null;

        try{
            connection = connectToDatabase();
            route.startServer();

            // if(connection != null){
            //     connection.close();
            //     System.out.println("Datanase connection closed");
            // }

        }catch (IOException e){
            e.printStackTrace();
        }
    }

    private static Connection connectToDatabase(){
        Connection connection = null;
        try{
            // Load MySQL JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish the connection
            connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
            System.out.println("Succesfully Connected to the database !!");
        }catch(ClassNotFoundException e){
            System.err.println("MYSQL JDBC Driver not found");
            e.printStackTrace();
        }catch(SQLException e){
            System.err.println("Failed to connect to the database.");
            e.printStackTrace();
        }
        return connection;
    }
}
