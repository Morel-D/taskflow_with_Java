import { useContext, useState } from "react"
import axiosInstance from "../utils/axiosInstance";
import { errorMessages } from "../utils/errorMessage";
import { catchApiErrors } from "../utils/catchApiError";
import { AuthContext } from "../context/authContext";

export const authActivityService = () => {
    const [loading, setLoading] = useState(false);
    const {setActivity} = useContext(AuthContext);
    const {setUserToken} = useContext(AuthContext);


    // POST REQUEST **********************************************************

    const createActivity = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            localStorage.setItem("activity", JSON.stringify(response.data.data));
            setActivity(response.data.data);
            localStorage.setItem("token", JSON.stringify(response.data.token));
            setUserToken(response.data.token);
            console.log("Activity --> ", response.data);
            return response.data;
        }catch(error){
            return catchApiErrors(error);
        }finally{
            setLoading(false)
        }
    }

    const addUsers = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            // console.log("INVITE ACTIVITY --> ", response);
            return response.data;
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
            // console.log("ACESS ACTIVITY --> ", response);
            return response.data;
        }catch(error){
            return catchApiErrors(error);
        }finally {
            setLoading(false);
        }
    }

    const collaboratorActivity = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.put(endpoint, data);
            console.log("COLLABORATOR ACTIVITY --> ", response);
            localStorage.setItem("token", JSON.stringify(response.data.token));
            setUserToken(response.data.token);
            return response.data;
        }catch(error){
            return catchApiErrors(error);
        }finally{
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }
    }

    const managerUserActivity =  async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            console.log("MANAGER ACTIVITY --> ", response);
            localStorage.setItem("token", JSON.stringify(response.data.token));
            setUserToken(response.data.token);
            return response.data;
        }catch(error){
            return catchApiErrors(error);
        }finally{
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        }
    }


    return {loading, createActivity, accessActivity, addUsers, collaboratorActivity, managerUserActivity}

}