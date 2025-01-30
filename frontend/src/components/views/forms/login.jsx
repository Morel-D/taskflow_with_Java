import { useContext, useState } from "react";
import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";
import { generateUniqueId, validateEmail } from "../../utils/helper";
import { authApiService } from "../../service/authService";
import { ButtonLoading } from "../../widgets/loading";
import { ErrorMessage } from "../../widgets/message";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ok from "../../../assets/icons/messages/ok.png";

const Login = ({handleSwitch, exit, setExit}) => {

    const navigate = useNavigate();

    const newUid = generateUniqueId();
    const {login, loading} = authApiService();

    const {setUser, setActivity} = useContext(AuthContext);

    const [email, setEmail] = useState();
    const [password, setPasword] = useState();

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, message: ""});
    const [success, setSuccess] = useState(false);

    // Check for valide email......


    const handleLogin = async (e) => 
    {
        e.preventDefault();
        setAlert({showMessage: false, message: ""});
        
        if(email == undefined || email == ""){
            setEmailError(true);
            return;
        }
        if(password == undefined || password == ""){
            setPasswordError(true);
            return;
        }
        if(email == undefined || email == "" && password == undefined || password == "")
        {
            setEmailError(true);
            setPasswordError(true);
            return;
        }
        if(!validateEmail(email)){
            setEmailError(true);
            return;
        }


        const data = 
        {
            "uid": newUid,
            "email": email,
            "password": password
        }

        const response = await login("auth/login", data);

        console.log("response -->", response);

        if(response.status == true){
            localStorage.setItem("user", JSON.stringify(response.user));
            setUser(response.user);
        if(response.message == "no-userActivity"){
            // navigate("/option/setting", {replace: true});
            // navigate("/option/setting");
            setSuccess(true); // Trigger success animation
            setTimeout(() => {
                setExit(true);
            }, 1000)

        }else if(response.message == "activity-present"){
            localStorage.setItem("activity", JSON.stringify(response.activity));
            setActivity(response.activity);
            navigate("/option/invite");
        }else if(response.message == "user-pending"){
            navigate("/option/collaborate");
        }

        }else if(response.status == false){
            setAlert({showMessage: true, message: response.error})
        }
    }


    const handleClose = () => {
        setAlert({showMessage: false, message: ""})
    }

    return ( 
        <>
            <div className="form col-9" style={{ paddingTop: "8rem", paddingLeft: "14rem" }}>
                <h2 style={{ color: colors.primaryColor }}>Welcome Back</h2>
                <p>Take control of your tasks, projects, and productivity today.</p>

                <motion.div
                    animate={emailError ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
                    transition={{ duration: 0.5 }} // Quick animation
                className="mt-3">
                    <TextFeild placeholder="Enter your email" value={email} onChange={(e) => {setEmailError(false); setEmail(e.target.value)}} maxLength={30} error={emailError} />
                </motion.div>

                <motion.div
                    animate={passwordError ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
                    transition={{ duration: 0.5 }}
                className="mt-3">
                    <TextFeild placeholder="Enter your password" value={password} onChange={(e) => {setPasswordError(false); setPasword(e.target.value)}} maxLength={15} error={passwordError} />
                </motion.div>

                <div className="mt-5">
                {success ? (
                    <motion.img 
                    src={ok}
                    alt="success"
                    initial={{ y: -20, scale: 0.5, opacity: 0 }}
                    animate={{ y: [0, -10, 0], scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    style={{ width: 50, height: 50 }}
                    />
                ) : (loading ? <ButtonLoading /> :<PrimaryButton children="Log In" onClick={handleLogin} />)}
                </div>

                <div className="mt-4">
                    Don't have an account ?{" "}
                    <a className="text-green" href="#" onClick={loading ? '' : handleSwitch}>
                    Sign In
                    </a>
                </div>
            </div>
            {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}
        </>
     );
}
 
export default Login;