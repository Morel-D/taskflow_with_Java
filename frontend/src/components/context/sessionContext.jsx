import { createContext, useContext, useEffect, useState } from "react";
import { useSessionService } from "../service/sessionService";
import { AuthContext } from "./authContext";

export const SessionContext = createContext();

export const SessionProvider = ({children}) =>
{
    const {loading, getActivityById} = useSessionService();
    const [session, setSession] = useState();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        const getActivityInfo = async() =>{
            try{
                const response = await getActivityById(user.uid);
                console.log("THE SESSION RESPONSE 1 --> ", session);
                setSession(response);
                setSession(response);
                console.log("THE SESSION RESPONSE 2 --> ", session);
            }catch(error){
                console.log("Something went wrong --> ", error);
            }
        }
        getActivityInfo();
    }, []);

    return (
        <SessionContext.Provider value={{session}}>
            {children}
        </SessionContext.Provider>
    )
}