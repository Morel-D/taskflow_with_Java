import dashbaord from "../../assets/icons/navbar/dashbaord.png";
import tasks from "../../assets/icons/navbar/tasks.png";
import people from "../../assets/icons/navbar/people.png";
import folder from "../../assets/icons/navbar/folder.png";

import dashbaord_blk from "../../assets/icons/navbar/dashbaord_blk.png";
import tasks_blk from "../../assets/icons/navbar/tasks_blk.png";
import people_blk from "../../assets/icons/navbar/people_blk.png";
import folder_blk from "../../assets/icons/navbar/folder_blk.png";
import { TextIconFeild } from "../widgets/textFeilds";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";



const Navbar = () => {

    const location = useLocation(); 
    const [route, setRoute] = useState(location.pathname);
  
    useEffect(() => {
      setRoute(location.pathname); 
    }, [location]);


    const logoStyle = {
        fontWeight: "bold",
        fontSize: "24px",
        color: "#333"
      };

    // Material.................

    return ( 
        <section className="container-fluid sidebar">
            <div className="">
            <div style={logoStyle} className="mt-4 mb-5">
                <h2>TaskFlow</h2>
            </div>
            <div className="menu mt-5">
                <ul className="list-unstyled"> 
                    <Link to="/dashboard/"><li className=""><a  className={route == "/dashboard/" ? "active-link" : "link"}><img src={route == "/dashboard/" ? dashbaord_blk : dashbaord} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Dashbaord</a></li></Link>
                    <Link to="/dashboard/task"><li className=""><a  className={route == "/dashboard/task" ? "active-link" : "link"}><img src={route == "/dashboard/task" ? tasks_blk : tasks} className="img-fluid icon-link mb-1" /> <span className="mx-1"></span> Tasks</a></li></Link>
                    <Link to="/dashboard/activity"><li className=""><a  className={route == "/dashboard/activity" ? "active-link" : "link"}><img src={route == "/dashboard/activity" ? folder_blk : folder} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Activity</a></li></Link>
                    <Link to="/dashboard/collaborator"><li className=""><a  className={route == "/dashboard/collaborator" ? "active-link" : "link"}><img src={route == "/dashboard/collaborator" ? people_blk : people} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Collaborators</a></li></Link>
                </ul>
            </div>
        </div>
        </section>
     );
}
 
export default Navbar;