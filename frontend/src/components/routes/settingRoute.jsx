import { Route, Routes } from "react-router-dom";

const SettingRoutes = () => {
    return ( 
        <div className="row py-4">
            <div className="container-fluid">
                <Routes>
                    <Route path="/option" element = {<Option />} />
                </Routes>
            </div>
        </div>
     );
}
 
export default SettingRoutes;