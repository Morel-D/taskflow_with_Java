import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../views/modules/home";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";

const RequireToken = ({children}) => {
    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!token){
            console.log("NO TOKEN ---> ");
            navigate('/login');
        }
    }, [navigate])

    return children;
}
 
export default RequireToken;