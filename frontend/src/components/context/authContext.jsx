import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => 
{
    // HANDLE USER STORAGE..........................
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setUserToken] = useState(JSON.parse(localStorage.getItem('token')) || null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedToken = JSON.parse(localStorage.getItem('token'));
        if(storedUser){
            setUser(storedUser);
        }

        if(storedToken){
            setUserToken(storedToken)
        }
    }, []);

    //LOG OUT OPERATION..............................
    const logout = () => 
    {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{user, setUser, logout, token}}>
            {children}
        </AuthContext.Provider>
    )
}