import activeTask from "../../assets/icons/navbar/task_active.png";
import project from "../../assets/icons/navbar/projects.png";
import calendar from "../../assets/icons/navbar/calendar.png";
import team from "../../assets/icons/navbar/team.png";
import report from "../../assets/icons/navbar/report.png";


const Navbar = () => {
    return ( 
        <section className="sidebar">
            <div className="container">
                <div className="log py-2">
                    <h2>TaskFlow</h2>
                </div>
            </div>
            <hr />
            <div className="container">
            <h5 className="text-dark text-bold">MANAGE</h5>
            <div className="menu mt-3">
                <ul className="list-unstyled"> 
                    <li className="active-li"><a href="/" className="link"><img src={activeTask} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Tasks</a></li>
                    <li className="mt-2"><a href="/projects" className="link"><img src={project} className="img-fluid icon-link mb-1" /> <span className="mx-1"></span> Projects</a></li>
                    <li className="mt-2"><a href="/service" className="link"><img src={calendar} className="img-fluid icon-link mb-1" /> <span className="mx-1"></span> Calendar</a></li>
                    <li className="mt-2"><a href="/company" className="link"><img src={team} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Collaborators</a></li>
                    <li className="mt-2"><a href="/links" className="link"><img src={report} className="img-fluid icon-link mb-1" /><span className="mx-1"></span> Reports</a></li>
                </ul>
            </div>
        </div>
        </section>
     );
}
 
export default Navbar;