import { useApiServce } from "./apiService"

export const userTaskService = () => {
    const {loading, postData, getAllData, getDataByID, upateData, deleteData} = useApiServce();

    const endpoint = "tasks";

    const createTask = (data) => postData(endpoint, data);
    const fetchTasks = () => getAllData(endpoint);
    const fetchHighTasks = () => getAllData(`${endpoint}/high`);
    const fetchMeduimTasks = () => getAllData(`${endpoint}/meduim`);
    const fetchLowTasks = () => getAllData(`${endpoint}/low`);
    const fetchTaskById = (id) => getDataByID(endpoint, id);
    const updateTask = (data, id) => upateData(endpoint, id, data);
    const deleteTask = (id) => deleteData(id);

    return {loading, createTask, fetchTasks, fetchHighTasks, fetchMeduimTasks, fetchLowTasks, fetchTaskById, updateTask, deleteTask}
}