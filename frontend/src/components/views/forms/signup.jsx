import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";

const SignUp = ({handleSwitch}) => {
    return ( 
        <div className="form col-9" style={{ paddingTop: "8rem", paddingLeft: "14rem" }}>
            <h2 style={{ color: colors.primaryColor }}>Welcome to TaskFlow</h2>
            <p>Take control of your tasks, projects, and productivity today.</p>

            <div className="mt-4">
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

            <div className="mt-4">
                Already have an account?{" "}
                <a className="text-green" href="#" onClick={handleSwitch}>
                Login
                </a>
            </div>
        </div>
     );
}
 
export default SignUp;