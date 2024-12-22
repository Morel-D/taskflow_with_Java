import { colors } from "../tools/color";
import { PrimaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import myIcon from "../../assets/icons/notebook.svg";
import { useState } from "react";
import SignUp from "./forms/signup";
import Login from "./forms/login";

const Auth = () => {

    const [isSwitched, setIsSwitched] = useState(false); // State to toggle positions
    

    const handleSwitch = () => {
      setIsSwitched(!isSwitched); // Toggle the state
    };

    return ( 
        <div className="container-fluid p-2">
            <div className="row">

                <div className={`col col-4 form-container ${isSwitched ? "form-right" : ""}`}>
                    {isSwitched ?
                (
                <div className="auth-box">
                    <div className="p-5">
                        <p className="text-white fs-3">TaskFlow</p>
                        <div style={{ paddingLeft: "5px" }}>
                        <img src={myIcon} alt="My Icon" width="350" height="350" />
                        </div>
                        <div className="auth-left-content" style={{ paddingTop: "0rem", paddingRight: "2rem" }}>
                        <h2 className="text-white text-bold">Login</h2>
                        <p className="text-white mt-4 fs-5">
                            Your productivity journey continues. Log in to pick up right where you left off.
                        </p>
                        </div>
                    </div>
                </div>
                ): 
                (
                    <div className="auth-box">
                    <div className="p-5">
                        <p className="text-white fs-3">TaskFlow</p>
                        <div style={{ paddingLeft: "5px" }}>
                        <img src={myIcon} alt="My Icon" width="350" height="350" />
                        </div>
                        <div className="auth-left-content" style={{ paddingTop: "0rem", paddingRight: "2rem" }}>
                        <h2 className="text-white text-bold">Sign up</h2>
                        <p className="text-white mt-4 fs-5">
                            Creating an account is quick and easy. Join thousands of users already boosting their productivity.
                        </p>
                        </div>
                    </div>
                </div>
                )    
                }
                </div>

                <div className={`col box-container ${isSwitched ? "box-left" : ""}`}>
                    {isSwitched ? <Login handleSwitch={handleSwitch} /> : <SignUp handleSwitch={handleSwitch} />}
                </div>
            </div>
        </div>
     );
}
 
export default Auth;