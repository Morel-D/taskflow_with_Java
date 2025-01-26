import { useContext, useState } from "react"
import axiosInstance from "../utils/axiosInstance";
import { errorMessages } from "../utils/errorMessage";
import { AuthContext } from "../context/authContext";

export const authApiService = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);


    const signUp = async (endpoint, data) => {
        try{
            // console.log("AUTH SIGNUP endpoint : ", endpoint);
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            console.log("POST DATA : ", response);
            localStorage.setItem("user", JSON.stringify(response.data.data));
            setUser(response.data);
            return response;
        }catch(error){
            if(error.response){
                const status = error.response.data.message;
                return {"status": false, "error": errorMessages[status]};
            }else if(error.request){
                return {"status": false, "error": errorMessages.NETWORK_ERROR};
            }else {
                return {"status": false, "error": errorMessages.UNKNOWN_ERROR};
            }
        }finally{
            setLoading(false);
        }
    }

    const login = async (endpoint, data) => {
        try{
            // console.log("AUTH LOGIN endpoint : ", endpoint);
        setLoading(true);
        const response = await axiosInstance.post(endpoint, data);
        console.log("POST DATA : ", response);
        return response.data;
        }catch(error){
            console.log("ERROR -> ", error);
            if(error.response){
                const status = error.response.data.message;
                return {"status": false, "error": errorMessages[status]};
            }else if(error.request){
                return {"status": false, "error": errorMessages.NETWORK_ERROR};
            }else {
                return {"status": false, "error": errorMessages.UNKNOWN_ERROR};
            }
        }finally{
            setLoading(false);
        }
    }

    return {loading, signUp, login}
}