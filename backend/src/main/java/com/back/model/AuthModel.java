package com.back;

public class AuthModel {
    private String uid;
    private String username;
    private String email;
    private String password;
    private String status;

    public AuthModel(){}
    
    public AuthModel(String uid, String username, String email, String password, String status){
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.status = status;
    }


    public String getUid(){
        return uid;
    }

    public void setUId(String uid){
        this.uid = uid;
    }


    public String getUsername(){
        return username;
    }

    public void setUserName(String username){
        this.username = username;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    }
    
    
    public String getPassword(){
        return password;
    }

    public void setPassword(String password){
        this.password = password;
    }


    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
