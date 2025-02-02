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
import { AnimatePresence, motion } from "framer-motion";


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
       <AnimatePresence>
            <div>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="row" style={{width: "1000px"}}>
                        <motion.div
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 100}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                        className="col responsive-option-img mt-5">
                            <img src={activity} alt="My Icon" width="350" height="350" />
                        </motion.div>
                        <div className="col col-12 d-lg-none text-center">
                            <img src={activity} alt="My Icon" width="250" height="250" />
                        </div>
                        <motion.div
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 100}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.5}}                        
                        className="col">
                            <h2>Create Your Activity</h2>
                            <p>Create an activity where you can set your goals, define tasks, and invite collaborators to join you. </p>
                            <div className="activity-form">
                                <div>
                                <TextFeild placeholder="Enter your activity name" value={name} onChange={(e) => {setErrorName(false); setName(e.target.value)}} error={errorName} />
                                </div>

                                <div>
                                    <TextAreaFeild placeholder="Give a brief description of your activity" row={3} value={description} onChange={(e) => {setErrorDescription(false); setDescription(e.target.value)} } error={errorDescription} />
                                </div>

                                <div>
                                    <TextFeild placeholder="Enter your access code (4 to 6 digits)" value={code} onChange={(e) => {setErrorCode(false); setCode(e.target.value)}} error={errorCode} />
                                </div>

                                <div>
                                    <TextFeild placeholder="Confirm your access code" value={codeConfimration} onChange={(e) => {setErrorCodeConfirm(false); setCodeConfimation(e.target.value)}} error={errorCodeConfirmError} />
                                </div>

                                <div className="mt-5">
                                    {loading ? <ButtonLoading /> : <PrimaryButton children="Create activity" onClick={handleCreation} /> }
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}
            </div>
       </AnimatePresence>
     );
}
 
export default AuthActivity;