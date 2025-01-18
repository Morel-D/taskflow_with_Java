import { Route, Routes } from "react-router-dom";
import AuthActivity from "../views/authActivity";
import Invitation from "../views/invitation";
import Options from "../views/options";

const SettingRoutes = () => {
    return ( 
        <div className="row">
            <div className="container-fluid">
                <Routes>
                    <Route path="setting" element = {<Options />} />
                    <Route path="activity" element = {<AuthActivity />} />
                    <Route path="invite" element = {<Invitation />} />
                </Routes>
            </div>
        </div>
     );
}
 
export default SettingRoutes;