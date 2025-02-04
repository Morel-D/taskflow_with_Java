import dashbaord from "../../assets/icons/navbar/dashbaord.png";
import tasks from "../../assets/icons/navbar/tasks.png";
import people from "../../assets/icons/navbar/people.png";
import search from "../../assets/icons/search.png";
import folder from "../../assets/icons/navbar/folder.png";
import { TextIconFeild } from "../widgets/textFeilds";
import { Link } from "react-router-dom";



const Navbar = () => {

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
            <div className="mb-4">
                <TextIconFeild  icon={search} placeholder="Search..."/>
            </div>
            <div className="menu mt-2">
                <ul className="list-unstyled"> 
                    <Link to="/dashboard/" className=""><li className="active-link"><a  className="link"><img src={dashbaord} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Dashbaord</a></li></Link>
                    <Link to="/dashboard/task"><li className=""><a  className="link"><img src={tasks} className="img-fluid icon-link mb-1" /> <span className="mx-1"></span> Tasks</a></li></Link>
                    <Link to="/dashboard/activity"><li className=""><a  className="link"><img src={folder} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Activity</a></li></Link>
                    <Link to="/dashboard/collaborator"><li className=""><a  className="link"><img src={people} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Collaborators</a></li></Link>
                </ul>
            </div>
        </div>
        </section>
     );
}
 
export default Navbar;