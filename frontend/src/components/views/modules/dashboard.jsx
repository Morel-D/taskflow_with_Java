import { useEffect, useState } from "react";
import { colors } from "../../tools/color";
import { useTaskService } from "../../service/taskService";
import {PieChart} from "react-minimal-pie-chart";

const Dashboard = () => {

    const {fetchTasks, getAllAssinedTask, getAllAssinedTaskByUsers} = useTaskService();

    const [data, setData] = useState([]);
    const [assigned, setAssigned] = useState([]);

    let todoTask, inprogress, doneTask;
    let num = 1;

    useEffect(() => {

        // Get data ....................................
        const getAllTask = async () => {
            const response = await fetchTasks();

            setData(response.data);
        }

        const getAssignedTask = async () => {
            const response = await getAllAssinedTask();
            setAssigned(response.data);
        }

        const getAssignedTAskByUsers = async () => {
            const response = await getAllAssinedTaskByUsers();
            console.log("The users assigned --> ", response);

            if(response == undefined){
                print("Data undefine man");
            }else if(response.status == "true"){
                setAssigned(response.data);
            }
        }

        getAssignedTAskByUsers();
        getAssignedTask();
        getAllTask();

    }, []);

    const unassignedTasks = data.filter(
        task => !assigned.some(assign => assign.taskUid === task.uid)
      );

      const unassignedCount = unassignedTasks.length;

    
        inprogress = data.filter(task => task.status === "progress").length;
        todoTask = data.filter(task => task.status === "todo").length;
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
                <div className="col col-6">
                    <div className="custom-card">
                        <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Assigned Tasks</h5>
                        <hr />
                        <div className="table-responsive scrollable-tbody">
                            <table className="table table-hover custom-table">
                                <thead>
                                    <tr className="custom-row-head">
                                        <th scope="col" >#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Number of task</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                         assigned && assigned.map((assign) => (
                                            <tr className="custom-row">
                                                <th>{num++}</th>
                                                <td>{assign.username}</td>
                                                <td>{assign.email}</td>
                                                <td className="text-center">{assign.tasks}</td>
                                                <td></td>
                                            </tr>
                                         ))
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
                <div className="col">
                    <h5 className="fw-bold mt-2 mb-3" style={{color: colors.secondaryColor}}>Pie Illustration</h5>
                    <div className="container mt-3">
                        <div className="d-flex">
                            <div className="col">
                                <div className="d-flex gap-2 text-dark"><div style={{height: "20px", width: "20px", borderStyle: "none", backgroundColor: colors.secondaryColor}}></div>  Todo Task</div>
                                <div className="d-flex gap-2 text-dark"><div style={{height: "20px", width: "20px", borderStyle: "none", backgroundColor: colors.blurPrimaryColor}}></div> In progress task</div>
                                <div className="d-flex gap-2 text-dark"><div style={{height: "20px", width: "20px", borderStyle: "none", backgroundColor: colors.primaryColor}}></div> Completed task</div>
                            </div>
                            <div className="col mt-5 text-end"  style={{height: "240px", width: "240px"}}>
                                    <PieChart
                                lineWidth={60}  // Controls the thickness of the chart
                                radius={50}     // Keeps the hole proportional
                                data={[
                                    { title: "Todo Task", value: todoTask, color: colors.secondaryColor },
                                    { title: "In progress", value: inprogress, color: colors.blurPrimaryColor },
                                    { title: "Done", value: doneTask, color: colors.primaryColor },
                                ]}
                                label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                                labelPosition={60} // Moves label outward
                                labelStyle={{
                                    fontSize: "8px",  // Adjust for better fit
                                    fontFamily: "sans-serif",
                                    fill: "#fff",
                                    fontWeight: "500",
                                    textAlign: "center",
                                }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
     );
}
 
export default Dashboard;