import { useContext } from "react";
import { useApiServce } from "./apiService"
import { SessionContext } from "../context/sessionContext";

export const useSessionService = () => {
    const {loading, getDataByID, postData, upateData, deleteData} = useApiServce();

    const endpoint = "protected";

    const getActivityById = (id) => getDataByID(`protected/${id}`);
    const getCollaborators = (id) => getDataByID(`${endpoint}/collaborators/${id}`);
    const addUser = (data) => postData("protected/user/add", data);
    const upadateStatus = (data) => upateData("protected/update", data);
    const removeCollaborator = (data) => deleteData("protected/delete", data);

    return {loading, getActivityById, getCollaborators, addUser, upadateStatus, removeCollaborator}
}