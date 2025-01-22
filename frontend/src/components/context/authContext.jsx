import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => 
{
    // HANDLE USER STORAGE..........................
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setUserToken] = useState(JSON.parse(localStorage.getItem('token')) || null);
    const [activity, setActivity] = useState(JSON.parse(localStorage.getItem('activity')) || null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = JSON.parse(localStorage.getItem('token'));
        const storedActivity = JSON.parse(localStorage.getItem('activity'));
        if(storedUser){
            setUser(storedUser);
        }

        if(storedToken){
            setUserToken(storedToken)
        }

        if(storedActivity){
            setActivity(storedActivity)
        }
    }, []);

    //LOG OUT OPERATION..............................
    const logout = () => 
    {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{user, setUser, logout, setActivity, setUserToken, token, activity}}>
            {children}
        </AuthContext.Provider>
    )
}