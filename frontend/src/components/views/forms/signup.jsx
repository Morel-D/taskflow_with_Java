import { useState } from "react";
import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";
import { validateEmail } from "../../utils/helper";

const SignUp = ({handleSwitch}) => {

    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    // ERRROS...............

    const [userNameError, setUserNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passordError, setPasswordError] = useState(false);
    const [confirmPassordError, setConfirmPasswordError] = useState(false);

    const handleSigIn = (e) => {
        e.preventDefault();

        if(userName == undefined || userName == ""){
            setUserNameError(true);
            return;
        }
        if(email == undefined || email == ""){
            setEmailError(true);
            return;
        }
        if(password == undefined || password == ""){
            setPasswordError(true);
            return;
        }
        if(confirmPassword == undefined || confirmPassword == ""){
            setConfirmPasswordError(true);
            return;

        }
        if(userName == undefined || userName == "" && email == undefined || email == "" && password == undefined || password == "" && confirmPassword == undefined || confirmPassword == "")
        {
            setUserNameError(true);
            setEmailError(true);
            setPasswordError(true);
            setConfirmPasswordError(true);
            return;
        }

        if(password === confirmPassword){
            setConfirmPasswordError(true);
            return;
        }
         if(!validateEmail(email)){
            setEmailError(true);
         }
    }


    return ( 
        <div className="form col-9" style={{ paddingTop: "8rem", paddingLeft: "14rem" }}>
            <h2 style={{ color: colors.primaryColor }}>Welcome to TaskFlow</h2>
            <p>Take control of your tasks, projects, and productivity today.</p>

            <div className="mt-4">
                <TextFeild placeholder="Enter your username" value={userName} onChange={(e) => {setUserNameError(false); setUserName(e.target.value)}} error={userNameError} />
            </div>

            <div className="mt-3">
                <TextFeild placeholder="Enter your email" value={email} onChange={(e) => {setEmailError(false); setEmail(e.target.value)}} error={emailError} />
            </div>

            <div className="mt-3">
                <TextFeild placeholder="Enter your password" value={password} onChange={(e) => {setPasswordError(false); setPassword(e.target.value)}} error={passordError} />
            </div>

            <div className="mt-3">
                <TextFeild placeholder="Confirm password" value={confirmPassword} onChange={(e) => {setConfirmPasswordError(false); setConfirmPassword(e.target.value)}} error={confirmPassordError} />
            </div>

            <div className="mt-5">
                <PrimaryButton children="Sign up" onClick={handleSigIn} />
            </div>

            <div className="mt-4">
                Already have an account?{" "}
                <a className="text-green" href="#" onClick={handleSwitch}>
                Login
                </a>
            </div>
        </div>
     );
}
 
export default SignUp;