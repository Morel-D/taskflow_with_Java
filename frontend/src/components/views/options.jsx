import { colors } from "../tools/color";
import option from "../../assets/icons/option.svg";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { generateUniqueId } from "../utils/helper";
import { authActivityService } from "../service/authActivityService";
import { Loading } from "../widgets/loading";
import { useNavigate } from "react-router-dom";

const Options = () => {

    const navigate = useNavigate();

    const {user} = useContext(AuthContext);
    const {managerUserActivity, loading} = authActivityService();

    const handleUserActivity = async () => {

        const uid = generateUniqueId();

        var data = {
            "uid": uid,
            "userId": user.uid,
            "activityId": "null",
            "role": "user",
            "status": "true"
        }

        const response = await managerUserActivity("activity/create/managerActivity", data);
        if(response.status == "true"){
            const currentPath = window.location.pathname;
            const modifiedPath = currentPath.replace("/option/setting", "/");
            navigate(modifiedPath);
        }

        console.log("The data is --> ", data);
    }

    return ( 
        <>
        {loading ? 
        (<div className="vh-100 d-flex justify-content-center align-items-center">
            <Loading />
        </div>) : 
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="row" style={{width: "1000px"}}>
                <div className="col">
                    <div className="mt-5"></div>
                    <img src={option} alt="My Icon" width="350" height="350" />
                </div>
                <div className="col col-7">
                    <h2 style={{paddingLeft: "20px"}}>How would you like to participate ?</h2>
                    <div className="options-container mt-3">
                        <div className="btn-container">
                            <a href="/option/activity" style={{textDecoration: "none"}}>
                            <span className="title fw-bold fs-5" style={{color: colors.secondaryColor}}>Create an Activity</span><br />
                            <span className="text-secondary">Take the lead by creating an activity where you can invite collaborators 
                                and manage tasks as the organizer.</span>
                            </a>
                        </div>
                        <div className="btn-container">
                            <a style={{textDecoration: "none"}} onClick={handleUserActivity}>
                            <span className="title fw-bold fs-5" style={{color: colors.secondaryColor}}>Solo Operation</span><br />
                            <span className="text-secondary">manage the activity entirely on your own. This is ideal for personal tasks 
                                where no collaboration is needed.</span>
                            </a>
                        </div>
                        <div className="btn-container">
                            <a href="/option/collaborate" style={{textDecoration: "none"}}>
                            <span className="title fw-bold fs-5" style={{color: colors.secondaryColor}}>Join an Existing Activity</span><br />
                            <span className="text-secondary">Access an activity created by someone else and take part as a collaborator. 
                            </span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <p className="text-green">Select one option</p>
                </div>
            </div>
        </div>
        }
        </>

     );
}
 
export default Options;