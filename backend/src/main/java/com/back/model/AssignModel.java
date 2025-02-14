package com.back;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AssignModel {

    private String uid;
    private String taskUid;
    private String userActivityUid;
    private String status;   

    public AssignModel(){}

    public AssignModel(String uid, String taskUid, String userActivityUid, String status){
        this.uid = uid;
        this.taskUid = taskUid;
        this.userActivityUid = userActivityUid;
        this.status = status;
    }

    public String getUid(){
        return uid;
    }

    public void setUid(String uid){
        this.uid = uid;
    }



    public String getTaskUid(){
        return taskUid;
    }

    public void setTaskUid(String taskUid){
        this.taskUid = taskUid;
    }



    public String getUserActivityUid(){
        return userActivityUid;
    }

    public void setUserActivityUid(String userActivityUid){
        this.userActivityUid = userActivityUid;
    }


    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }

}
