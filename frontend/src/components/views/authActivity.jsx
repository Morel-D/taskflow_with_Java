import { PrimaryButton } from "../widgets/button";
import { TextAreaFeild, TextFeild } from "../widgets/textFeilds";
import activity from "../../assets/icons/activity.svg"
import { useContext, useState } from "react";
import { generateUniqueId } from "../utils/helper";
import { AuthContext } from "../context/authContext";
import { authActivityService } from "../service/authActivityService";
import { ButtonLoading } from "../widgets/loading";
import { ErrorMessage } from "../widgets/message";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const AuthActivity = () => {

    const {user} = useContext(AuthContext);
    const {createActivity, loading} = authActivityService();
    const navigate = useNavigate();
 
    // Input Information.....................................................
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [code, setCode] = useState();
    const [codeConfimration, setCodeConfimation] = useState();

    const [alert, setAlert] = useState({showMessage: false, message: ""});

    // Feild Errors.........................................................
    const[errorName, setErrorName] = useState(false);
    const[errorDescription, setErrorDescription] = useState(false);
    const[errorCode, setErrorCode] = useState(false);
    const[errorCodeConfirmError, setErrorCodeConfirm] = useState(false);

    const handleClose = () => {
        setAlert({showMessage: false, message: ""});
    }

    const handleCreation = async (e) => {
        e.preventDefault();
        setAlert({showMessage: false, message: ""});


        const uid = generateUniqueId();

        if(name == undefined || name == ""){
            setErrorName(true);
            return;
        }
        if(description == undefined || description == ""){
            setErrorDescription(true);
            return;
        }
        if(code == undefined || code == ""){
            setErrorCode(true);
            return;
        }
        if(codeConfimration == undefined || codeConfimration == ""){
            setErrorCodeConfirm(true);
            return;
        }
        if(code != codeConfimration){
            setErrorCodeConfirm(true);
            setAlert({showMessage: true, message: "Confirmation code incorrect"});
            setCodeConfimation('');
            return;
        }

        var data = {
            "userUid": user.uid,
            "userName": user.username,
            "email": user.email,
            "uid": uid,
            "name": name,
            "description": description,
            "accessCode": code,
            "createdBy": user.uid,
            "status": "true"
        }

        const response = await createActivity("activity", data);
        console.log("THE DATA --> ", response);


        if(response.status == false){
            setAlert({showMessage: true, message: response.error})
        }else if(response.status == "true"){
            navigate('/option/invite');
        }
        
    }


    return ( 
        <motion.div
        initial={{ opacity: 0, x: 100 }} // Next page starts from the right
        animate={{ opacity: 1, x: 0 }} // Next page moves into view
        exit={{ opacity: 0, x: -100 }} // Current page fades out to the left
        transition={{ duration: 0.6, ease: "easeInOut" }} // Smooth transition        
        >
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="row" style={{width: "1000px"}}>
                    <div className="col responsive-option-img mt-5">
                        <img src={activity} alt="My Icon" width="350" height="350" />
                    </div>
                    <div className="col col-12 d-lg-none text-center">
                        <img src={activity} alt="My Icon" width="250" height="250" />
                    </div>
                    <div className="col">
                        <h2>Create Your Activity</h2>
                        <p>Create an activity where you can set your goals, define tasks, and invite collaborators to join you. </p>
                        <div className="activity-form">
                            <motion.div
                             animate={errorName ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                             transition={{ duration: 0.5 }}
                             className="mt-4">
                            <TextFeild placeholder="Enter your activity name" value={name} onChange={(e) => {setErrorName(false); setName(e.target.value)}} error={errorName} />
                            </motion.div>

                            <motion.div
                            animate={errorDescription ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                            transition={{ duration: 0.5 }}
                             className="mt-3">
                                <TextAreaFeild placeholder="Give a brief description of your activity" row={3} value={description} onChange={(e) => {setErrorDescription(false); setDescription(e.target.value)} } error={errorDescription} />
                            </motion.div>

                            <motion.div
                             className="mt-3"
                             animate={errorCode ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                             transition={{ duration: 0.5 }}                             
                             >
                                <TextFeild placeholder="Enter your access code (4 to 6 digits)" value={code} onChange={(e) => {setErrorCode(false); setCode(e.target.value)}} error={errorCode} />
                            </motion.div>

                            <motion.div
                             className="mt-3"
                             animate={errorCodeConfirmError ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                             transition={{ duration: 0.5 }}   
                             >
                                <TextFeild placeholder="Confirm your access code" value={codeConfimration} onChange={(e) => {setErrorCodeConfirm(false); setCodeConfimation(e.target.value)}} error={errorCodeConfirmError} />
                            </motion.div>

                            <div className="mt-5">
                                {loading ? <ButtonLoading /> : <PrimaryButton children="Create activity" onClick={handleCreation} /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}
        </motion.div>
     );
}
 
export default AuthActivity;