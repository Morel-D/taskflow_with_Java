package src;

import java.io.IOException;

import src.route.Route;

public class App {
    public static void main(String[] args) {
        Route route = new Route();

        try{
            route.startServer();
        }catch (IOException e){
            e.printStackTrace();
        }
    }
}
