import { useContext, useState } from "react";
import { PrimaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import { authActivityService } from "../service/authActivityService";
import { AuthContext } from "../context/authContext";
import { ErrorMessage } from "../widgets/message";
import { useNavigate } from "react-router-dom";
import { ButtonLoading } from "../widgets/loading";
import { AnimatePresence, motion } from "framer-motion";
import work from "../../assets/icons/work.svg";

const Intro = () => {

    const {accessActivity, loading} = authActivityService();
    const {user} = useContext(AuthContext);

    const [code, setCode] = useState();
    const [codeError, setCodeError] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, message: ""});
    const navigate = useNavigate();

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
        }else if(response.status == "true"){
            localStorage.setItem("activityUid", response.uid);
            localStorage.setItem("activityUid", response.uid);
            const currentPath = window.location.pathname;
            const modifiedPath = currentPath.replace("/option/collaborate", "");
            navigate(`${modifiedPath}/option/organisation`);
        }

    }

    return ( 
        <AnimatePresence mode="wait">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="row" style={{display: "flex"}}>
                    <motion.div
                    initial={{opacity: 0, x: 100}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 100}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                    className="col d-none d-lg-block text-center">
                        <img src={work} alt="My Icon" width="450" height="450" />
                    </motion.div>
                    <div className="mobile-auth-title mt-2 mb-5 text-center">
                        <h2>TaskFlow</h2>
                    </div>
                    <motion.div
                    initial={{opacity: 0, x: 100}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 100}}
                    transition={{duration: 0.8, ease: "easeOut", delay: 0.5}}
                    className="col col mt-5 py-lg-5 mx-lg-0 mx-2">
                    <div className="">
                    <h2 className="text-lg-start text-center">Access Your Activity Workspace</h2>
                    <p className="mt-3"> Collaborate seamlessly with your team and stay aligned on your shared goals. Start making an impact today !</p> 

                    <div className="form mt-4">
                        <TextFeild placeholder="Enter the access code" value={code} onChange={(e) => {setCodeError(false); setCode(e.target.value)}} error={codeError} />
                        <div className="mt-4">
                        {loading ? <ButtonLoading /> : <PrimaryButton children="Verify" onClick={handleCodeVerification} />}
                        </div>
                        <div className="mt-3 text-start">
                            <p className="text-secondary">Don’t have an access code? Contact your admin.</p>
                        </div>
                    </div>               
                </div>
                    </motion.div>
                </div>
            </div>
            {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}
        </AnimatePresence>
     );
}
 
export default Intro;