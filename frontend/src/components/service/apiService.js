import {useState} from "react";
import axiosInstance from "../utils/axiosInstance";
import { errorMessages } from "../utils/errorMessage";

export const useApiServce = () => {
    const [loading, setLoading] = useState(false);

    // INSERT DATA****************************

    const postData = async(endpoint, data) => {
        try{
            console.log("POST : endpoint ", endpoint);
            setLoading(true);
            const response = await axiosInstance.post(endpoint, data);
            console.log('POST DATA : ', response);
            return response.data;
        }catch(error){
            // if backend retrun error 
            if(error.response){
                const status = error.response.message;
                return errorMessages[status];
            }else if (error.request){
                // Request made but no response was received
                return errorMessages.NETWORK_ERROR
            }else {
                return errorMessages.UNKNOWN_ERROR
            }
        }finally{
            setLoading(false);
        }
    }


    // GET ALL DATA*********************************

    const getAllData = async(endpoint) => {
        try{
            setLoading(true);
            const response = await axiosInstance.get(endpoint);
            if(response){
                console.log('GET ALL DATA : ', response);
                return response.data;
            }
        }catch(error){
            console.log('Err - GET ALL DATA : ', error);
        }finally{
            setLoading(false);
        }
    }


    // GET DATA BY ID**********************************

    const getDataByID = async(endpoint, id) => {
        try{
            setLoading(true);
            const response = await axiosInstance.get(endpoint);
            if(response){
                console.log('GET DATA BY ID : ', response);
                return response.data;
            }
        }catch(error){
            console.log('Err - GET ALL DATA : ', error);
        }finally{
            setLoading(false);
        }
    }

    // UPDATE DATA BY ID**********************************

    const upateData = async (endpoint, id, data) => {
        try {
            setLoading(true);
            const response = await axiosInstance.put(endpoint, data);
            if(response){
                console.log('UPDATE DATA : ', response);
                return response.data;
            }
        }catch(error){
            console.log("Err - UPDATE DATA : ", error)
        }finally{
            setLoading(false);
        }
    }

    // DELETE DATA BY ID**********************************
    const deleteData = async (endpoint) => {
        try{
            setLoading(true);
            const response = await axiosInstance.delete(endpoint);
            if(response){
                console.log('DATA DELETED : ', response);
                return response.data;
            }
        }catch(error){
            console.log('Err - DATA DELETED : ', error);
        }
    }


    return {loading, postData, getAllData, getDataByID, upateData, deleteData}
}