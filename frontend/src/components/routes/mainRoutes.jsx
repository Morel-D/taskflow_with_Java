import { Routes, Route } from "react-router-dom";
import Navbar from "../modules/navbar";
import Header from "../modules/header";
import Home from "../views/modules/home";
import Admin from "../views/admin";
import { SessionProvider } from "../context/sessionContext";
import { useEffect } from "react";

const MainRoutes = () => {

    useEffect(() => {
        console.log("The use effect here");
    }, [])

    return ( 
        <SessionProvider>
            <div>
                <div className="">
                    <div className="content">
                        <Routes>
                            <Route path="/dashboard/*" element={<Admin />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </SessionProvider>
     );
}
 
export default MainRoutes;