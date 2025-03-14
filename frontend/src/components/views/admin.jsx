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
import BottomBar from "../modules/bottomBar";

const Admin = () => {

    const {session} = useContext(SessionContext);

    useEffect(() => {
        console.log("The effect here is --> ", session);
    }, [session])

    return ( 
        <div className="d-flex">
            {/* Sidebar */}
            <div className="d-none d-lg-block container-fluid vh-100 bg-white sidebar col col-2" 
                style={{ borderStyle: "solid", borderWidth: "0px 1px 0px 0px", borderColor: colors.grey3Color }}>
                <Navbar />
            </div>
    
            {/* Main Content */}
            <div className="col d-flex flex-column vh-100">
                {/* Header */}
                <div className="header" 
                    style={{ borderStyle: "solid", borderWidth: "0px 0px 1px 0px", borderColor: colors.grey3Color }}>
                    <Header />
                </div>
    
                {/* Page Content */}
                <div className="body-pages p-4 flex-grow-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/task" element={<Home />} />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/collaborator" element={<Collaborators />} />
                    </Routes>
                </div>
    
                {/* Bottom Bar Always at Bottom */}
                <div className="mt-auto d-lg-none d-block">
                    <BottomBar />
                </div>
            </div>
        </div>
    );
    
}
 
export default Admin;