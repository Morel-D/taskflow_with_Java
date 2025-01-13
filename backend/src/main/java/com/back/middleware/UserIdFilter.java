package com.back;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import java.util.HashMap;

import com.fasterxml.jackson.databind.ObjectMapper;

public class UserIdFilter implements Filter {
    public final ObjectMapper objectMapper = new ObjectMapper();


    // Database Connection
    private final Connection connection;
    
    // Construction to pass the database connection
    public UserIdFilter(Connection connection){
        this.connection = connection;
    }


    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) req;
        HttpServletResponse httpResponse = (HttpServletResponse) res;

        // check for the userId
        Object userId = httpRequest.getAttribute("userId");

        if(userId == null || !isUserValid(userId.toString())){
            httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
            Map<String, Object> response = new HashMap<>();
            response.put("status", "false");
            response.put("message", "userId-unauthorized");
            objectMapper.writeValue(httpResponse.getWriter(), response);
            return;
        }

        chain.doFilter(req, res);
    }

    // method to check if the userId exist in the database
    private boolean isUserValid(String userId){
        String query = "SELECT COUNT(*) FROM user WHERE uid = ?";
        try(PreparedStatement statement = connection.prepareStatement(query)){
            statement.setString(1, userId);
            ResultSet resultSet = statement.executeQuery();
            if(resultSet.next()){
                return resultSet.getInt(1) > 0;
            }
        }catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public void destroy(){}
}
