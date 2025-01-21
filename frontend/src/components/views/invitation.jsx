import { useContext, useState } from "react";
import team from "../../assets/icons/team.svg";
import { PrimaryButton, SecondaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import { AuthContext } from "../context/authContext";
import { colors } from "../tools/color";
import { authActivityService } from "../service/authActivityService";
import { generateUniqueId, validateEmail } from "../utils/helper";
import { ErrorMessage } from "../widgets/message";

const Invitation = () => {

    const {addUsers} = authActivityService();
    const   {activity} = useContext(AuthContext);

    const [alert, setAlert] = useState({showMessage: false, message: ""});

    const [email, setEmail] = useState();
    const [emailError, setEmailError] = useState(false);


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
            "role": "user",
            "status": "pending"
        }

        const response = await addUsers("activity/user/add", data);
        console.log("FRONT-PATH --> ", response);

        if(response.status == false){
            setAlert({showMessage: true, message: response.error})
        }
    }

    

    return ( 
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="row">
                    <div className="col">
                        <img src={team} alt="My Icon" width="450" height="450" />
                    </div>
                    <div className="col mt-5 py-5">
                        <h5 className="text" style={{color: colors.primaryColor}}>Wer're almost there !! 🎉</h5>
                        <h2>Invite a Collaborator</h2>
                        <p>Invite teammates, colleagues, or friends to join your activity and work together toward a shared goal. </p>
                        <div className="">
                            <TextFeild placeholder="Enter the user's email" value={email} onChange={(e) => {setEmailError(false); setEmail(e.target.value)}} error={emailError} />
                        </div>
                        <div className="mt-4">
                            <div className="row">
                                <div className="col">
                                    <PrimaryButton children="Search"  onClick={handleInvitation}/>
                                </div>
                                
                                    <div className="col text-end">
                                        <SecondaryButton children="Do it later" />
                                    </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {alert.showMessage && <ErrorMessage message={alert.message} onClick={handleClose} />}            
        </>
     );
}
 
export default Invitation;