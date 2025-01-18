import { colors } from "../tools/color";
import option from "../../assets/icons/option.svg";

const Options = () => {
    return ( 
        <>
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
                            <label className="title fw-bold fs-5" style={{color: colors.secondaryColor}}>Create an Activity</label>
                            <label className="text-secondary">Take the lead by creating an activity where you can invite collaborators 
                                and manage tasks as the organizer.</label>
                        </div>
                        <div className="btn-container">
                            <label className="title fw-bold fs-5" style={{color: colors.secondaryColor}}>Solo Operation</label>
                            <label className="text-secondary">manage the activity entirely on your own. This is ideal for personal tasks 
                                where no collaboration is needed.</label>
                        </div>
                        <div className="btn-container">
                            <label className="title fw-bold fs-5" style={{color: colors.secondaryColor}}>Join an Existing Activity</label>
                            <label className="text-secondary">Access an activity created by someone else and take part as a collaborator. 
                            </label>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <p className="text-green">Select one option</p>
                </div>
            </div>
        </div>
        </>

     );
}
 
export default Options;