import { colors } from "../tools/color";
import { PrimaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";
import myIcon from "../../assets/icons/notebook.svg";
import typing from "../../assets/icons/typing.svg";
import { useEffect, useState } from "react";
import SignUp from "./forms/signup";
import Login from "./forms/login";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Auth = () => {

    const [isSwitched, setIsSwitched] = useState(false); // State to toggle positions
    const [exit, setExit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(exit){
            console.log("Let's get started...");
            setTimeout(() => {
                navigate("/option/setting");
            }, 500)
        }
    }, [exit, navigate])
    

    const handleSwitch = () => {
      setIsSwitched(!isSwitched); // Toggle the state
    };

    return ( 
        <>

             <div
 
             className="container-fluid p-2">
                 <div className="row">
 
                     <AnimatePresence>
                        {!exit && (
                            <motion.div
                            initial={{ x: 0 }}
                            exit={{ x: -100, opacity: 0 }} // Exit left
                            transition={{ duration: 0.5 }}                            
                            className={`col col-4 form-container ${isSwitched ? "form-right" : ""}`}>
                            <AnimatePresence mode="wait">
                                    {isSwitched ? (
                                        <div className="auth-box">
                                        <div className="p-5">
                                            <p className="text-white fs-3 fw-bold">TaskFlow</p>
                                            <div style={{ paddingLeft: "5px" }}>
                                            <motion.img
                                                key="login-image"
                                                src={typing}
                                                alt="My Icon"
                                                width="350"
                                                height="350"
                                                initial={{ opacity: 0, scale: 0.8 }}  // Start faded and smaller
                                                animate={{ opacity: 1, scale: 1 }}    // Fade in and scale up
                                                exit={{ opacity: 0, scale: 0.8 }}     // Fade out and shrink
                                                transition={{ duration: 0.5 }}        // Smooth timing
                                            />
                                            </div>
                                            <div className="auth-left-content" style={{ paddingTop: "0rem", paddingRight: "2rem" }}>
                                            <h3 className="text-white fw-bold">Login</h3>
                                            <p className="text-white mt-4 fs-5">
                                                Your productivity journey continues. Log in to pick up right where you left off.
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    ) : (
                                        <div className="auth-box">
                                        <div className="p-5">
                                            <p className="text-white fs-3 fw-bold">TaskFlow</p>
                                            <div style={{ paddingLeft: "5px" }}>
                                            <motion.img
                                                key="signup-image"
                                                src={myIcon}
                                                alt="My Icon"
                                                width="350"
                                                height="350"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                            </div>
                                            <div className="auth-left-content" style={{ paddingTop: "0rem", paddingRight: "2rem" }}>
                                            <h2 className="text-white text-bold">Sign up</h2>
                                            <p className="text-white mt-4 fs-5">
                                                Creating an account is quick and easy. Join thousands of users already boosting their productivity.
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    )}
                                    </AnimatePresence>
                        </motion.div>
                        )}
                     </AnimatePresence>

                     <AnimatePresence mode="wait">
                        {!exit && (
                            <motion.div
                            key={isSwitched ? "login" : "signup"}
                            initial={{ opacity: 0, x: 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ x: isSwitched ? 50 : -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}                            
                            className={`col box-container ${isSwitched ? "box-left" : ""}`}
                            >
                                <div className="mobile-auth-title mt-2 mb-5 text-center">
                                <img src={isSwitched ? typing : myIcon} alt="My Icon" width="250" height="250" />
                                    <h2>TaskFlow</h2>
                                </div>
                                    {isSwitched ? <Login handleSwitch={handleSwitch} exit={exit} setExit={setExit} /> : <SignUp handleSwitch={handleSwitch} />}
                            </motion.div>
                        )}
                     </AnimatePresence>
                 </div>
             </div>
        </>
     );
}
 
export default Auth;