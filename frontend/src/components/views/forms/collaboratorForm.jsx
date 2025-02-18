import { useContext, useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";
import { generateUniqueId, validateEmail } from "../../utils/helper";
import { SessionContext } from "../../context/sessionContext";
import { useSessionService } from "../../service/sessionService";

const CollaboratorForm = ({setAlert, closeModal}) => {

    const [text, setText] = useState();
    const [error, setError] = useState();
    const {loading, addUser} = useSessionService();
    const {session} = useContext(SessionContext);    

    const handleInvitation = async () => {
        if(text == undefined || text == ""){
            setError(true);
            return;
        }

        if(!validateEmail(text)){
            setError(true);
            return;
        }

        const uid = generateUniqueId();

        const data = {
            "email": text,
            "uid": uid,
            "activityId": session.activity.uid,
            "role": "collaborator",
            "status": "pending"
        }

        console.log("The added collaborator heree is  --> ", data);

        const response = await addUser(data);
        console.log("COLLABORATORS-PATH --> ", response);

        if(response != undefined){
            console.log("Not undefeinf");
            if(response.status == false){
                setAlert({showMessage: true, messageType: "fail", message: response.error});
                closeModal();
                return;
            }else if(response.status == "true"){
                setAlert({showMessage: true, messageType: "success", message: "New collabortor on pending mode added"});
                console.log("Response data ---> ", data);
                closeModal();
                return;
            }
        }else{
            setAlert({showMessage: true, messageType: "fail", message: "Unknown error"});
            closeModal();
            return;
        }
    }

    return ( 
       <div className="mt-2">
            <p>Invite teammates, colleagues, or friends to join your activity and work together toward a shared goal. </p>
            <TextFeild placeholder="Enter the user's email" value={text} onChange={(e) => {setError(false); setText(e.target.value)}} error={error} />
            <label className="py-2 text-green fw-bold">Note :</label>
            <p className="text-dark">Users already invited in another activity or registed on <b>Solo Opertion</b> mode won't be authorise</p>
            <div className="cta mt-4 text-end">
                <PrimaryButton children="Add" onClick={handleInvitation} />
            </div>
       </div> 
     );
}
 
export default CollaboratorForm;