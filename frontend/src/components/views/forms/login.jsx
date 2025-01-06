import { useState } from "react";
import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";
import { generateUniqueId, validateEmail } from "../../utils/helper";

const Login = ({handleSwitch}) => {

    const newUid = generateUniqueId();

    const [email, setEmail] = useState();
    const [password, setPasword] = useState();

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    // Check for valide email......


    const handleLogin = (e) => 
    {
        e.preventDefault();
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
        }


        const data = 
        {
            // "uid": newUid,
            "email": email,
            "password": password
        }
    }

    return ( 
        <div className="form col-9" style={{ paddingTop: "8rem", paddingLeft: "14rem" }}>
        <h2 style={{ color: colors.primaryColor }}>Welcome Back</h2>
        <p>Take control of your tasks, projects, and productivity today.</p>

        <div className="mt-3">
            <TextFeild placeholder="Enter your email" value={email} onChange={(e) => {setEmailError(false); setEmail(e.target.value)}} maxLength={30} error={emailError} />
        </div>

        <div className="mt-3">
            <TextFeild placeholder="Enter your password" value={password} onChange={(e) => {setPasswordError(false); setPasword(e.target.value)}} maxLength={15} error={passwordError} />
        </div>

        <div className="mt-5">
            <PrimaryButton children="Log In" onClick={handleLogin} />
        </div>

        <div className="mt-4">
            Don't have an account ?{" "}
            <a className="text-green" href="#" onClick={handleSwitch}>
            Sign In
            </a>
        </div>
    </div>
     );
}
 
export default Login;