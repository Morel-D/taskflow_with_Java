import { useState } from "react"
import axiosInstance from "../utils/axiosInstance";

export const authApiService = () => {
    const [loading, setLoading] = useState(false);


    const signUp = async (endpoint, data) => {
        try{
            console.log("AUTH SIGNUP endpoint : ", endpoint);
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            console.log("POST DATA : ", response);
            return response;
        }catch(error){
            console.log("Error -> ", error);
        }finally{
            setLoading(false);
        }
    }

    const login = async (endpoint, data) => {
        try{
            console.log("AUTH LOGIN endpoint : ", endpoint);
        setLoading(true);
        const response = await axiosInstance.post(endpoint, data);
        console.log("POST DATA : ", response);
        return response;
        }catch(error){
            console.log("ERROR -> ", error)
        }finally{
            setLoading(false);
        }
    }

    return {loading, signUp, login}
}