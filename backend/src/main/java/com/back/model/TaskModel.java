package com.back;

import java.sql.Timestamp;

public class TaskModel {
    // private String id;
    private String uid;
    private String activityId;
    private String ownerId;
    private String title;
    private String description;
    private String category;
    private String status;
    private Timestamp dueDate;

    public TaskModel(){} // Default constructor for JSON decentralization

    public TaskModel(String uid, String activityId, String ownerId,  String title, String description, String category, String status, Timestamp dueDate){
        this.uid = uid;
        this.activityId = activityId;
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.status = status;
        this.dueDate = dueDate;
    }

    public String getUid(){
        return uid;
    }

    public void setUId(String uid){
        this.uid = uid;
    }


    public String getActivityId(){
        return activityId;
    }

    public void setActivityId(String activityId){
        this.activityId = activityId;
    }


    
    public String getOwnerId(){
        return ownerId;
    }

    public void setOwnerId(String ownerId){
        this.ownerId = ownerId;
    }



    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title = title;
    }


    
    public String getDescription(){
        return description;
    }

    public void setDescription(String description){
        this.description = description;
    }


    public String getCategory(){
        return category;
    }

    public void setCategory(String category){
        this.category = category;
    }



    public Timestamp getDueDate(){
        return dueDate;
    }

    public void setDueDate(Timestamp dueDate){
        this.dueDate = dueDate;
    }

    

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
