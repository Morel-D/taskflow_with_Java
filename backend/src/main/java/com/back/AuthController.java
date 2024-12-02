package com.back;

import java.io.IOException;
import java.sql.Connection;
import java.util.Map;
import java.util.HashMap;


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
        responseMap.put("message", "This is the response");

        objectMapper.writeValue(res.getWriter(), responseMap);
    }
    
}
