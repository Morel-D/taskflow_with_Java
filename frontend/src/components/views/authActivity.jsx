import { PrimaryButton } from "../widgets/button";
import { TextAreaFeild, TextFeild } from "../widgets/textFeilds";
import activity from "../../assets/icons/activity.svg"
import { useState } from "react";

const AuthActivity = () => {

    // Input Information.....................................................
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [code, setCode] = useState();

    // Feild Errors.........................................................
    const[errorName, setErrorName] = useState(false);
    const[errorDescription, setErrorDescription] = useState(false);
    const[errorCode, setErrorCode] = useState(false);

    const handleCreation = async (e) => {
        e.preventDefault();
        
    }


    return ( 
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="row" style={{width: "1000px"}}>
                <div className="col mt-5">
                    <img src={activity} alt="My Icon" width="350" height="350" />
                </div>
                <div className="col">
                    <h2>Create Your Activity</h2>
                    <p>Create an activity where you can set your goals, define tasks, and invite collaborators to join you. </p>
                    <div className="activity-form">
                        <div className="mt-4">
                        <TextFeild placeholder="Enter your activity name" />
                        </div>
                        <div className="mt-3">
                            <TextAreaFeild placeholder="Give a brief description of your activity" row={3} />
                        </div>
                        <div className="mt-3">
                            <TextFeild placeholder="Enter your access code (4 to 6 digits)" />
                        </div>
                        <div className="mt-3">
                            <TextFeild placeholder="Confirm your access code" />
                        </div>
                        <div className="mt-5">
                            <PrimaryButton children="Create activity" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default AuthActivity;