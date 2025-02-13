import { useApiServce } from "./apiService"

export const useSessionService = () => {
    const {loading, getDataByID} = useApiServce();

    const endpoint = "protected";

    const getActivityById = (id) => getDataByID(`protected/${id}`);
    const getCollaborators = (id) => getDataByID(`${endpoint}/collaborators/${id}`);

    return {loading, getActivityById, getCollaborators}
}