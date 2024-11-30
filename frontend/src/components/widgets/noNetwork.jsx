import wifi from "../../assets/icons/wi-fi.png"
import { colors } from "../tools/color";
import { PrimaryButton } from "./button";

const NoNetwork = ({onClick}) => {
    return ( 
        <div className="text-center py-5">
            <img src={wifi} style={{width: "200px", height: "200px"}} />
            <h2 className="mt-2">No Internet connection</h2>
            <p className="fs-5 mb-5">Please check your internet connection and try again</p>
            <PrimaryButton children="Try again" onClick={onClick} />
        </div>
     );
}
 
export default NoNetwork;