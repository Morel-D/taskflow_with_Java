import { useApiServce } from "./apiService"

export const useTaskService = () => {
    const {loading, postData, getAllData, getDataByID, upateData, deleteData} = useApiServce();

    const endpoint = "task";

    const createTask = (data) => postData(endpoint, data);
    const fetchTasks = () => getAllData(endpoint);
    const fetchHighTasks = () => getAllData(`${endpoint}/high`);
    const fetchMeduimTasks = () => getAllData(`${endpoint}/medium`);
    const fetchLowTasks = () => getAllData(`${endpoint}/low`);
    const fetchTaskById = (id) => getDataByID(`${endpoint}/${id}`);
    const updateTask = (id, data) => upateData(`${endpoint}/${id}`, data);
    const deleteTask = (id) => deleteData(`${endpoint}/${id}`);

    return {loading, createTask, fetchTasks, fetchHighTasks, fetchMeduimTasks, fetchLowTasks, fetchTaskById, updateTask, deleteTask}
}