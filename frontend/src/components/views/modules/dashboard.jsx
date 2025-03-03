import { useEffect, useState } from "react";
import { colors } from "../../tools/color";
import { useTaskService } from "../../service/taskService";

const Dashboard = () => {


    const [data, setData] = useState([]);
    const [assigned, setAssigned] = useState([]);
    const {fetchTasks, getAllAssinedTask} = useTaskService();

    let doneTask, unAssigned;

    useEffect(() => {

        // Get data ....................................
        const getAllTask = async () => {
            const response = await fetchTasks();

            setData(response.data);
        }

        const getAssignedTask = async () => {
            const response = await getAllAssinedTask();

            console.log("The assignes task is --> ", response);
            setAssigned(response.data);
        }

        getAssignedTask();
        getAllTask();

    }, []);

    const unassignedTasks = data.filter(
        task => !assigned.some(assign => assign.taskUid === task.uid)
      );

      const unassignedCount = unassignedTasks.length;

    
        doneTask = data.filter(task => task.status === "done").length;
        console.log("done task --> ", doneTask);

    return ( 
        <section className="">
            {/* Different crards  */}
            <div className="title mb-4">
                <h3 className="fw-bold" style={{color: colors.secondaryColor}}>Dashboard</h3>
            </div>
            <div className="task">
                <div className="row">
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Total Tasks</label>
                            <p className="lg-num" >{data.length}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Assisgned Task</label>
                            <p className="lg-num" >{unassignedCount}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Completed Task</label>
                            <p className="lg-num" >{doneTask}</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Overdue Tasks</label>
                            <p className="lg-num" >4</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <div className="custom-card">
                        <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Assigned Tasks</h5>
                        <hr />
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </section>
     );
}
 
export default Dashboard;