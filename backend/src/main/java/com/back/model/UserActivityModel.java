package com.back;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserActivityModel {
    
    private String uid;
    private String userId;
    private String activityId;
    private String role;
    private String status;

    public UserActivityModel(){}

    public UserActivityModel(String uid, String userId, String activityId, String role, String status){
        this.uid = uid;
        this.userId = userId;
        this.activityId = activityId;
        this.role = role;
        this.status = status;
    }

    public String getUid(){
        return uid;
    }

    public void setUid(String uid){
        this.uid = uid;
    }

    public String getUserId(){
        return userId;
    }

    public void setUserId(String userId){
        this.userId = userId;
    }


    public String getActivityId(){
        return activityId;
    }

    public void setActivityId(String activityId){
        this.activityId = activityId;
    }


    public String getRole(){
        return role;
    }

    public void setRole(String role){
        this.role = role;
    }


    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
