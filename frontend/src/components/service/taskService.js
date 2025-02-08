import { useContext } from "react";
import { useApiServce } from "./apiService"
import { SessionContext } from "../context/sessionContext";

export const useTaskService = () => {
    const {loading, postData, getAllData, getDataByID, upateData, deleteData} = useApiServce();

    const endpoint = "protected/task";
    const {session} = useContext(SessionContext);
    let activityUid = session.activity.uid;

    const createTask = (data) => postData(endpoint, data);
    const fetchTasks = () => getAllData(endpoint);
    const fetchTodoTasks = () => getAllData(`${endpoint}/todo/${activityUid}`);
    const fetchProgressTasks = () => getAllData(`${endpoint}/progress/${activityUid}`);
    const fetchDoneTasks = () => getAllData(`${endpoint}/done/${activityUid}`);
    const fetchTaskById = (id) => getDataByID(`${endpoint}/${id}`);
    const updateTask = (id, data) => upateData(`${endpoint}/${id}`, data);
    const deleteTask = (id) => deleteData(`${endpoint}/${id}`);

    return {loading, createTask, fetchTasks, fetchTodoTasks, fetchProgressTasks, fetchDoneTasks, fetchTaskById, updateTask, deleteTask}
}