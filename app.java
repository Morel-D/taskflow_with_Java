import com.sun.net.httpserver.HttpServer;

// See this like a controller...
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class app {

    public static void main(String[] args) throws IOException {
        
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        server.createContext("/", new RootHandle());

        server.setExecutor(null);
        server.start();
        System.out.print("Server is listing to port 8000");
    }

    static class RootHandle implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException{
            String response = "This is a great world";

            exchange.sendResponseHeaders(200, response.length());

            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

}