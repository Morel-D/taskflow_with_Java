import { useContext, useState } from "react";
import team from "../../assets/icons/team.svg";
import { PrimaryButton, SecondaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import { AuthContext } from "../context/authContext";
import { colors } from "../tools/color";
import { authActivityService } from "../service/authActivityService";
import { generateUniqueId, validateEmail } from "../utils/helper";
import { ErrorMessage } from "../widgets/message";
import Modal from "../widgets/modal";
import InvitationSend from "./content/invitationSend";
import { ButtonLoading } from "../widgets/loading";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const Invitation = () => {

    const {addUsers, loading, managerUserActivity} = authActivityService();
    const {activity, user} = useContext(AuthContext);
    const navigate = useNavigate();

    const [alert, setAlert] = useState({showMessage: false, message: ""});

    const [email, setEmail] = useState();
    const [emailError, setEmailError] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    // const openModel = () => setIsOpen(true)
    const closeModal = () => {
        setEmail("");
        setIsOpen(false);
    }





    const handleClose = () => {
        setAlert({showMessage: false, message: ""});
    }

    const handleInvitation = async (e) => {
        e.preventDefault();

        if(email == undefined || email == ""){
            setEmailError(true);
            return;
        }

        if(!validateEmail(email)){
            setEmailError(true);
            return;
        }

        const uid = generateUniqueId();

        const data = {
            "email": email,
            "uid": uid,
            "activityId": activity.uid,
            "role": "collaborator",
            "status": "pending"
        }

        const response = await addUsers("activity/user/add", data);
        console.log("FRONT-PATH --> ", response);

        if(response.status == false){
            setAlert({showMessage: true, message: response.error})
        }else if(response.status == "true"){
            console.log("Response data --> ", data);
            setIsOpen(true);
        }
    }

    const handleManagerUserActivity = async () => {
        const uid = generateUniqueId();

        const data = {
            "uid": uid,
            "userId": user.uid,
            "activityId": activity.uid,
            "role": "manager",
            "status": "true"
        }

        const response = await managerUserActivity("activity/create/managerActivity", data);
        console.log("FRONT-PATH --> ", response);

        if(response.status == false){
            setAlert({showMessage: true, message: response.error})
        }else if(response.status == "true"){
            console.log("Response data --> ", data);
            const currentPath = window.location.pathname;
            const modifiedPath = currentPath.replace("/option/invite", "/");
            navigate(modifiedPath);
        }
    }

    

    return ( 
        <AnimatePresence mode="wait">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="row">
                    <motion.div
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 100}}
                        transition={{duration: 0.8, ease: "easeOut"}}                    
                    className="col d-none d-lg-block">
                        <img src={team} alt="My Icon" width="450" height="450" />
                    </motion.div>
                    <div className="mobile-auth-title mt-2 mb-5 text-center">
                        <h2>TaskFlow</h2>
                    </div>
                    <motion.div
                        initial={{opacity: 0, x: 100}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 100}}
                        transition={{duration: 0.8, ease: "easeOut", delay: 0.5}}                    
                    className="col mt-5 py-5">
                        <h5 className="text" style={{color: colors.primaryColor}}>Wer're almost there !! 🎉</h5>
                        <h2>Invite a Collaborator</h2>
                        <p>Invite teammates, colleagues, or friends to join your activity and work together toward a shared goal. </p>
                        <div className="">
                            <TextFeild placeholder="Enter the user's email" value={email} onChange={(e) => {setEmailError(false); setEmail(e.target.value)}} error={emailError} />
                        </div>
                        <div className="mt-4">
                            <div className="row">
                                <div className="col">
                                    {loading ? <ButtonLoading /> : <PrimaryButton children="Search"  onClick={handleInvitation}/>}
                                </div>
                                
                                    <div className="col text-end">
                                    {loading ? <ButtonLoading /> :  <SecondaryButton children="Do it later" onClick={handleManagerUserActivity} />}
                                    </div>
                                
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}  
            <Modal isOpen={isOpen} onClose={closeModal} children={<InvitationSend email={email} onClose={closeModal} onRoute={handleManagerUserActivity} />} title="" />          
        </AnimatePresence>
     );
}
 
export default Invitation;