import { Routes, Route, Router, Navigate } from "react-router-dom";
import Header from "../modules/header";
import Navbar from "../modules/navbar";
import { colors } from "../tools/color";
import Home from "./modules/home";
import Activity from "./modules/activity";
import Collaborators from "./modules/collaborators";
import Dashboard from "./modules/dashboard";
import { useContext, useEffect } from "react";
import { SessionContext } from "../context/sessionContext";

const Admin = () => {

    const {session} = useContext(SessionContext);

    useEffect(() => {
        console.log("The effect here is --> ", session);
    }, [session])

    return ( 
            <div className="d-flex">
                <div className="container-fluid vh-100 bg-white sidebar col col-2" style={{borderStyle: "solid", borderWidth: "0px 1px 0px 0px", borderColor: colors.grey3Color}}>
                    <Navbar />
                </div>
                <div className="col">
                    <div className="header" style={{borderStyle: "solid", borderWidth: "0px 0px 1px 0px", borderColor: colors.grey3Color}}>
                        <Header />
                    </div>
                    <div className="body-pages p-4">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/task" element={<Home />} />
                            <Route path="/activity" element={<Activity />} />
                            <Route path="/collaborator" element={<Collaborators />} />
                        </Routes>
                    </div>
                </div>
            </div>

     );
}
 
export default Admin;