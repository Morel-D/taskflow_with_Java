import { Routes, Route } from "react-router-dom";
import Navbar from "../modules/navbar";
import Header from "../modules/header";
import Home from "../views/home";

const MainRoutes = () => {
    return ( 
    <div className="row py-4">
        <div className="col col-2">
          <Navbar />
        </div>
        <div className="col container-fluid">
            <div className="header">
                <Header />
            </div>
            <div className="content">
                <Routes>
                    <Route path="/dashboard" element={<Home />} />
                </Routes>
            </div>
        </div>
    </div> 
     );
}
 
export default MainRoutes;