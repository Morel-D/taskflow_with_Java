import { useContext } from "react";
import { useApiServce } from "./apiService"
import { SessionContext } from "../context/sessionContext";

export const useTaskService = () => {
    const {loading, postData, getAllData, getDataByID, upateData, deleteData} = useApiServce();

    const endpoint = "protected/task";
    let activityUid;
    const {session} = useContext(SessionContext);
    console.log("(Task) Session is --> ", session);
    if(session != undefined){
        if(session.role == "manager" || session.role == "collaborator"){
            activityUid = session.activity.uid;
        }
    }

    const getActiveCollaborators = (id) => getAllData(`${endpoint}/get/active/collaborators/${id}`);
    const getAssignCollaboratorsByUid = (id) => getAllData(`${endpoint}/get/assign/${id}`);
    const getAllAssinedTask = () => getAllData(`${endpoint}/assign/`);
    const getAllAssinedTaskByUsers = () => getAllData(`${endpoint}/get/users/assign/`);
    const createTask = (data) => postData(endpoint, data);
    const fetchTasks = () => getAllData(endpoint);
    const fetchTodoTasks = () => getAllData(`${endpoint}/todo/${activityUid}`);
    const fetchProgressTasks = () => getAllData(`${endpoint}/progress/${activityUid}`);
    const fetchDoneTasks = () => getAllData(`${endpoint}/done/${activityUid}`);
    const fetchTaskById = (id) => getDataByID(`${endpoint}/${id}`);
    const updateTask = (id, data) => upateData(`${endpoint}/${id}`, data);
    const deleteTask = (id) => deleteData(`${endpoint}/${id}`);

    return {loading, getAllAssinedTask, getAllAssinedTaskByUsers, getActiveCollaborators, getAssignCollaboratorsByUid, createTask, fetchTasks, fetchTodoTasks, fetchProgressTasks, fetchDoneTasks, fetchTaskById, updateTask, deleteTask}
}