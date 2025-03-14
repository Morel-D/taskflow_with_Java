import dashbaord from "../../assets/icons/navbar/dashbaord.png";
import tasks from "../../assets/icons/navbar/tasks.png";
import people from "../../assets/icons/navbar/people.png";
import folder from "../../assets/icons/navbar/folder.png";

import dashbaord_blk from "../../assets/icons/navbar/dashbaord_blk.png";
import tasks_blk from "../../assets/icons/navbar/tasks_blk.png";
import people_blk from "../../assets/icons/navbar/people_blk.png";
import folder_blk from "../../assets/icons/navbar/folder_blk.png";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const BottomBar = () => {

    const location = useLocation();
    const [route, setRoute] = useState(location.pathname);

    useEffect(() => {
        setRoute(location.pathname);
    }, [location])

    return ( 
        <div className="bg-white mt-4 py-4 text-center">
            <div className="d-flex">
                <div className="col">
                    <Link to="/dashboard/"><img src={route == "/dashboard/" ? dashbaord_blk : dashbaord} className="img-fluid icon-link mb-1" /></Link>
                </div>
                <div className="col">
                    <Link to="/dashboard/task"><img src={route == "/dashboard/task" ? tasks_blk : tasks} className="img-fluid icon-link mb-1" /> </Link>
                </div>
                <div className="col">
                    <Link to="/dashboard/activity"><img src={route == "/dashboard/activity" ? folder_blk : folder} className="img-fluid icon-link mb-1" /></Link>
                </div>
                <div className="col">
                    <Link to="/dashboard/collaborator"><img src={route == "/dashboard/collaborator" ? people_blk : people} className="img-fluid icon-link mb-1" /></Link>
                </div>
            </div>
        </div>
     );
}
 
export default BottomBar;