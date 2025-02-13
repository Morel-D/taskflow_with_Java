import { useApiServce } from "./apiService"

export const useActivity =() => {
    const {loading} = useApiServce();

    const endpoint = "protected/activity";
    // const get

    return {loading}
}