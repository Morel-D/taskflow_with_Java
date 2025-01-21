import { useState } from "react"
import axiosInstance from "../utils/axiosInstance";
import { errorMessages } from "../utils/errorMessage";
import { catchApiErrors } from "../utils/catchApiError";

export const authActivityService = () => {
    const [loading, setLoading] = useState(false);

    // POST REQUEST **********************************************************

    const createActivity = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            localStorage.setItem("activity", JSON.stringify(response.data.data));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            return response.data;
        }catch(error){
            catchApiErrors(error);
        }finally{
            setLoading(false)
        }
    }

    const addUsers = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            console.log("INVITE ACTIVITY --> ", response);
        }catch(error){
            return catchApiErrors(error);
        }finally{
            setLoading(false);
        }
    }

    const accessActivity = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            console.log("ACESS ACTIVITY --> ", response);
        }catch(error){
            return catchApiErrors(error);
        }finally {
            setLoading(false);
        }
    }


    return {loading, createActivity, accessActivity, addUsers}

}