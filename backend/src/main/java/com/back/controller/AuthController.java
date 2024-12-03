package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Map;
import java.util.HashMap;

import com.back.model.AuthModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class AuthController extends HttpServlet {
    public final ObjectMapper objectMapper = new ObjectMapper();

    private final Connection connection;

    public AuthController(Connection connection){
        this.connection = connection;
    }


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {

        // Set response type
        res.setContentType("application/json");

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("Status", "true");
        responseMap.put("message", "This is the response for sure");

        objectMapper.writeValue(res.getWriter(), responseMap);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        
        // Set response type
        res.setContentType("application/json");

        String pathInfo = req.getPathInfo();
        AuthModel auth = objectMapper.readValue(req.getReader(), AuthModel.class);

        if(pathInfo == null || pathInfo.equals("/")){

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("status", "false");
            responseMap.put("error", "path-incomplete");

            objectMapper.writeValue(res.getWriter(), responseMap);
        }else if(pathInfo.equals("/signup")){
            String sql = "INSERT INTO user uid, username, email, password, status VALUES(?, ,?, ?, ?, ?, ?, ?)";
            try(PreparedStatement statement = connection.prepareStatement(sql)){
                statement.setUId(1, auth.getUid());
                statement.setUserName(2, auth.getUsername());
                statement.setEmail(3, auth.getEmail());
                statement.setUId(4, auth.getUid());
                statement.setUId(5, auth.getUid());

            }
        }
    }
    
}
