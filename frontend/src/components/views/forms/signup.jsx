import { useState } from "react";
import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";
import { generateUniqueId, validateEmail } from "../../utils/helper";
import { authApiService } from "../../service/authService";
import { ButtonLoading } from "../../widgets/loading";
import { ErrorMessage } from "../../widgets/message";
import { useNavigate } from "react-router-dom";

const SignUp = ({handleSwitch}) => {


    const {signUp, loading} = authApiService();
    const navigate = useNavigate();

    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    // ERRROS...............

    const [userNameError, setUserNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passordError, setPasswordError] = useState(false);
    const [confirmPassordError, setConfirmPasswordError] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, message: ""});

    const handleClose = () => {
        setAlert({showMessage: false, message: ""})
    }

    const handleSigIn = async (e) => {
        e.preventDefault();
        setAlert({showMessage: false, message: ""});

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

        if(password != confirmPassword){
            setConfirmPasswordError(true);
            setAlert({showMessage: true, message: "Confirmation password incorrect"});
            setConfirmPassword("");
            return;
        }
         if(!validateEmail(email)){
            setEmailError(true);
            return;
         }

         const uid = generateUniqueId();

         const data = 
         {
            "uid": uid,
            "username": userName,
            "email": email,
            "password": password,
            "status": "true"
         }

         const response = await signUp('auth/signup', data);

         console.log("UI SignUp -> ", response.data);

         if(response.data.status == 'false'){
            setAlert({showMessage: true, message: response.error})
        }else if(response.data.status == 'true'){
            console.log('The status is true');
            navigate('/setting/option');
        }
    }


    return ( 
        <>
            <div className="form col-9 responsive-form" style={{ paddingTop: "8rem", paddingLeft: "14rem" }}>
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
                    {loading ? <ButtonLoading /> :<PrimaryButton children="Sign up" onClick={handleSigIn} />}
                </div>

                <div className="mt-4">
                    Already have an account?{" "}
                    <a className="text-green" href="#" onClick={loading ? '' : handleSwitch}>
                    Login
                    </a>
                </div>
            </div>
        {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}
        </>
     );
}
 
export default SignUp;