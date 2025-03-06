import { useContext } from "react";
import { useApiServce } from "./apiService"
import { SessionContext } from "../context/sessionContext";

export const useSessionService = () => {
    const {loading, getDataByID, postData, upateData, deleteData} = useApiServce();

    const endpoint = "protected";

    // const {session} = useContext(SessionContext);
    // console.log("(Session) Session is --> ", session);

    const getActivityById = (id) => getDataByID(`protected/${id}`);
    const getCollaborators = (id) => getDataByID(`${endpoint}/collaborators/${id}`);
    const addUser = (data) => postData("protected/user/add", data);
    const upadateStatus = (id, data) => upateData(`protected/update/${id}`, data);
    const removeCollaborator = (id) => deleteData(`protected/delete/${id}`);

    return {loading, getActivityById, getCollaborators, addUser, upadateStatus, removeCollaborator}
}