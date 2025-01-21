import { useContext, useState } from "react";
import { PrimaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import { authActivityService } from "../service/authActivityService";
import { AuthContext } from "../context/authContext";
import { ErrorMessage } from "../widgets/message";

const Intro = () => {

    const {accessActivity} = authActivityService();
    const {user} = useContext(AuthContext);

    const [code, setCode] = useState();
    const [codeError, setCodeError] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, message: ""});

    const handleClose = () => {
        setAlert({showMessage: false, message: ""});
    }

    const handleCodeVerification = async (e) => {
        e.preventDefault();

        if(code == undefined || code == ""){
            setCodeError(true);
            return;
        }

        const data = {
        "accessCode": code,
        "userId": user.uid
        }

        console.log("DATA BEFORE SEND --> ", data);

        const response = await accessActivity("activity/user/invite", data);
        console.log("DATA RECIVE --> ", response);

        if(response.status == false){
            setAlert({showMessage: true, message: response.error})
        }

    }

    return ( 
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="" style={{width: "500px"}}>
                    <h2>Access Your Activity Workspace</h2>
                    <p className="mt-3"> Collaborate seamlessly with your team and stay aligned on your shared goals. Start making an impact today !</p> 

                    <div className="form mt-4">
                        <TextFeild placeholder="Enter the access code" value={code} onChange={(e) => {setCodeError(false); setCode(e.target.value)}} error={codeError} />
                        <div className="mt-4">
                        <PrimaryButton children="Verify" onClick={handleCodeVerification} />
                        </div>
                        <div className="mt-3 text-start">
                            <p className="text-secondary">Don’t have an access code? Contact your admin.</p>
                        </div>
                    </div>               
                </div>
            </div>
            {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}
        </>
     );
}
 
export default Intro;