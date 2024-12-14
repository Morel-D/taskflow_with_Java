package com.back;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UserActivityModel {
    
    private String uid;
    private String userId;
    private String activityId;
    private String status;

    public UserActivityModel(){}

    public UserActivityModel(String uid, String userId, String activityId, String status){
        this.uid = uid;
        this.userId = userId;
        this.activityId = activityId;
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


    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
