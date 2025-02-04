import { Routes, Route } from "react-router-dom";
import Navbar from "../modules/navbar";
import Header from "../modules/header";
import Home from "../views/modules/home";
import Admin from "../views/admin";

const MainRoutes = () => {
    return ( 
        <div>
            <div className="">
                <div className="content">
                    <Routes>
                        <Route path="/dashboard/*" element={<Admin />} />
                    </Routes>
                </div>
            </div>
        </div>
     );
}
 
export default MainRoutes;