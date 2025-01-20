import { useState } from "react"
import axiosInstance from "../utils/axiosInstance";
import { errorMessages } from "../utils/errorMessage";

export const authActivityService = () => {
    const [loading, setLoading] = useState(false);

    // POST REQUEST **********************************************************

    const createActivity = async (endpoint, data) => {
        try{
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            localStorage.setItem("activity", JSON.stringify(response.data.data));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            console.log("ACTIVITY CREATION : ", response);
            return response.data;
        }catch(error){
            console.log("The error is --> ", error);
            if(error.response){
                const status = error.response.data.message;
                return {"status": false, "error": errorMessages[status]};
            }else if(error.request){
                return {"status": false, "error": errorMessages.NETWORK_ERROR};
            }else{
                return {"status": false, "error": errorMessages.UNKNOWN_ERROR};
            }
        }finally{
            setLoading(false)
        }
    }

    return {loading, createActivity}

}