import { PrimaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";

const Intro = () => {
    return ( 
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="" style={{width: "450px"}}>
                <h2>Welcome to TaskFlow</h2>
                <p className="mt-3">Enter your access code below to unlock your personalized task manager and start organizing your day effortlessly.</p> 

                <div className="form mt-5">
                    <TextFeild placeholder="Enter the access code" />
                    <div className="mt-4">
                    <PrimaryButton children="Continue" />
                    </div>
                    <div className="mt-3 text-start">
                        <p className="text-secondary">Don’t have an access code? Contact your admin.</p>
                    </div>
                </div>               
            </div>
        </div>
     );
}
 
export default Intro;