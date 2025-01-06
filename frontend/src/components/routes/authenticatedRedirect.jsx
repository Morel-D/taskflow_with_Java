import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const AuthenticatedRedirect = ({children}) => {
    
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            console.log("USER PRESENT --> ");
            navigate('/');
        }
    }, [navigate])
    
    return children;
}
 
export default AuthenticatedRedirect;