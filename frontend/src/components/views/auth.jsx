import { colors } from "../tools/color";
import { PrimaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import myIcon from "../../assets/icons/notebook.svg";

const Auth = () => {
    return ( 
        <div className="container-fluid p-2">
            <div className="row">
                <div className="col col-6">
                    <div className="auth-box">
                        <div className="p-5">
                            <p className="text-white fs-3">TaskFlow</p>
                            <div style={{paddingLeft: "100px"}}>
                            <img src={myIcon} alt="My Icon" width="350" height="350" />
                            </div>
                            <div className="auth-left-content" style={{paddingTop: "2rem", paddingRight: "10rem"}}>
                                <h2 className="text-white text-bold">Sign up</h2>
                                <p className="text-white mt-4 fs-5">Creating an account is quick and easy. Join thousands of users already boosting their productivity
                                </p>
                            </div>
                            {/* <div className="auth-left-footer" style={{paddingTop: "7rem"}}>
                                <div className="container-btn col-8">
                                    <p style={{color: colors.blurPrimaryColor}}>Already have an account ?</p>
                                    <p className="text-white fw-bold">Login</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="form col-10" style={{paddingTop: "8rem", paddingLeft: "4rem"}}>
                        <h2 style={{color: colors.primaryColor}}>Welcome to TaskFlow</h2>
                        <p>Take control of your tasks, projects, and productivity today.</p>
                        
                       <div className="mt-5">
                       <TextFeild placeholder="Enter your username" /> 
                       </div>

                       <div className="mt-3">
                       <TextFeild placeholder="Enter your email" /> 
                       </div>

                       <div className="mt-3">
                       <TextFeild placeholder="Enter your password" /> 
                       </div>

                       <div className="mt-3">
                       <TextFeild placeholder="Confirm password" /> 
                       </div>

                       <div className="mt-5">
                       <PrimaryButton children="Sign up" /> 
                       </div>

                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Auth;