package com.back;

public class ActivityModel {
    private String uid;
    private String name;
    private String description;
    private int accesscode;
    private int created_by;
    private String status;

    public ActivityModel(){}

    public ActivityModel(String uid, String name, String description, int accesscode, int created_by, String status){
        this.uid = uid;
        this.name = name;
        this.description = description;
        this.accesscode = accesscode;
        this.created_by = created_by;
        this.status = status;
   }
   
   
   public String getUid(){
    return uid;
   }

   public void setUId(String uid){
    this.uid = uid;
   }



   public String getName(){
    return name;
   }

   public void setName(String name){
    this.name = name;
   }



   public String getDescription(){
    return description;
   }

   public void setDescription(String description){
    this.description = description;
   }



   public int getAccessCode(){
    return accesscode;
   }

   public void setAccessCode(int accesscode){
    this.accesscode = accesscode;
   }


   public int getCreatedBy(){
    return created_by;
   }


   public void setCreatedBy(int created_by){
    this.created_by = created_by;
   }


   public String getStatus(){
    return status;
   }
   

   public void setStatus(String status){
    this.status = status;
   }




}
