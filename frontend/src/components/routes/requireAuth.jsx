import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({children}) => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user){
            console.log("USER NOT PRESNT --->");
            navigate('/login');
        }
    }, [navigate])

    return children;
}
 
export default RequireAuth;