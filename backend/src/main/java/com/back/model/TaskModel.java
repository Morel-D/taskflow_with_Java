package com.back;

public class TaskModel {
    // private String id;
    private String uid;
    private String userActivityId;
    private String title;
    private String category;
    private String status;

    public TaskModel(){} // Default constructor for JSON decentralization

    public TaskModel(String uid, String userActivityId, String title, String category, String status){
        this.uid = uid;
        this.userActivityId = userActivityId;
        this.title = title;
        this.category = category;
        this.status = status;
    }

    public String getUid(){
        return uid;
    }

    public void setUId(String uid){
        this.uid = uid;
    }


    public String getUserActivityId(){
        return userActivityId;
    }

    public void setUserActivityId(String userActivityId){
        this.userActivityId = userActivityId;
    }


    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title = title;
    }



    public String getCategory(){
        return category;
    }

    public void setContent(String category){
        this.category = category;
    }

    

    public String getStatus(){
        return status;
    }

    public void setStatus(String status){
        this.status = status;
    }
}
