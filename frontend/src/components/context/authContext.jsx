import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => 
{
    // HANDLE USER STORAGE..........................
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if(storedUser){
            setUser(storedUser);
        }
    }, []);

    //LOG OUT OPERATION..............................
    const logout = () => 
    {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{user, logout}}>
            {children}
        </AuthContext.Provider>
    )
}