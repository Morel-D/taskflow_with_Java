import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const AuthenticatedRedirect = ({children}) => {
    
    const {token} = useContext(AuthContext);
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(token){
            console.log("TOKEN PRESENT --> ");
            navigate('/');
        }else if(user){
            console.log("USER PRESENT --> ");
            navigate('/option');
        }
    }, [navigate])
    
    return children;
}
 
export default AuthenticatedRedirect;