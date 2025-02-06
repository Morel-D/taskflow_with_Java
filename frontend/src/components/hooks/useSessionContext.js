import { useContext } from "react"
import { SessionContext } from "../context/sessionContext"

export const useSessionContext = () => {
    const context = useContext(SessionContext);

    if(!context){
        throw Error('useSessionContext must not be used inside the AuthContextProvider');
    }
}