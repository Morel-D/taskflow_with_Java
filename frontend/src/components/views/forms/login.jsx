import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { TextFeild } from "../../widgets/textFeilds";

const Login = ({handleSwitch}) => {
    return ( 
        <div className="form col-9" style={{ paddingTop: "8rem", paddingLeft: "14rem" }}>
        <h2 style={{ color: colors.primaryColor }}>Welcome Back</h2>
        <p>Take control of your tasks, projects, and productivity today.</p>

        <div className="mt-3">
            <TextFeild placeholder="Enter your email" />
        </div>

        <div className="mt-3">
            <TextFeild placeholder="Enter your password" />
        </div>

        <div className="mt-5">
            <PrimaryButton children="Log In" />
        </div>

        <div className="mt-4">
            Don't have an account ?{" "}
            <a className="text-green" href="#" onClick={handleSwitch}>
            Sign In
            </a>
        </div>
    </div>
     );
}
 
export default Login;