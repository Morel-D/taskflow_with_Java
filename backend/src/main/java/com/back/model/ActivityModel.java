package com.back;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ActivityModel {
    private String userUid;
    private String userName;
    private String email;
    private String uid;
    private String name;
    private String description;
    private int accesscode;
    private String created_by;
    private String status;

    public ActivityModel(){}

    public ActivityModel(String userUid, String userName, String email, String uid, String name, String description, int accesscode, String created_by, String status){
        this.userUid = userUid;
        this.userName = userName;
        this.email = email;
        this.uid = uid;
        this.name = name;
        this.description = description;
        this.accesscode = accesscode;
        this.created_by = created_by;
        this.status = status;
   }
   
   public String getUserUid(){
    return userUid;
   }

   public void setUserUid(String userUid){
    this.userUid = userUid;
   }

   public String getEmail(){
    return email;
   }

   public void setEmail(String email){
    this.email = email;
   }

   public String getUserName(){
    return userName;
   }

   public void setUserName(String userName){
    this.userName = userName;
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


   public String getCreatedBy(){
    return created_by;
   }


   public void setCreatedBy(String created_by){
    this.created_by = created_by;
   }


   public String getStatus(){
    return status;
   }
   

   public void setStatus(String status){
    this.status = status;
   }




}
