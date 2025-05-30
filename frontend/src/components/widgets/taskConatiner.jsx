import { useContext, useEffect, useState } from "react";
import { colors } from "../tools/color";
import edit from "../../assets/icons/edit.png";
import trash from "../../assets/icons/delete.png";
import Modal from "./modal";
import { DangerButton } from "./button";
import {ButtonLoading } from "./loading";
import { useTaskService } from "../service/taskService";
import Aos from "aos";
import TaskForm from "../views/forms/taskForm";
import users from "../../assets/icons/navbar/people.png";
import { TextTruncate } from "./formatText";
import { SessionContext } from "../context/sessionContext";

const TaskContainer = ({color, child, content, id, uid, setFetch, setAlert, category, categoryClassName, num}) => {


    useEffect(() => {
        Aos.init({duration: 2000});
    }, [])

    const {deleteTask} = useTaskService();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const {session} = useContext(SessionContext);

    const [isHovered, setIsHovered] = useState(false);
    const [deleteModal, setDeletModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const openDeleteModal = (e) => 
        {
            e.preventDefault();
            setDeletModal(true)
        };
    const closeDeleteModal = () => setDeletModal(false);



    const openEditModal = (e) => {
        e.preventDefault();
        setEditModal(true);
    };
    const closeEditModal = () => setEditModal(false);


    const handleDelete = async () => {
        setIsFading(false);
        try{
            setDeleteLoading(true);
            const response = await deleteTask(id);
            if(response.status == "true")
            {
            console.log('Data deleted : ', response);
            setAlert({showMessage: true, messageType: "success", message: "Task deleted"});
            setFetch(true);
            closeDeleteModal();
            }
                }catch(error){
            console.log('Modal data : Something went wrong : ', error);
        }finally{
            setDeleteLoading(false);
        }
    }


    return ( 
        <>
            <div className="task-container" 
                data-aos={!isFading ? "" : "fade-"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{borderColor: color ?? colors.grey2Color, padding: "10px", position: "relative", borderRadius: "5px" }}>                
                    <div className="col-10"><h6> {child}</h6></div>
                    <p>{<TextTruncate text={content} maxLength={90} /> ?? "No action"}</p>
                    <div className="d-flex">
                        <div className="col">
                            {num > 0 ? <label htmlFor=""><img src={users} className="img-fluid" style={{height: "24px"}} /> <label className=" text-secondary mx-2">{num ?? 0} {num > 1 ? "Collaborators" : "Collaborator"}</label></label> : <div className="mb-4"></div>  }
                        </div>
                        <div className="col text-end mt-2">
                            <span className={categoryClassName ?? "low-active-badge"}>{category ?? "undefine"}</span>
                        </div>
                    </div>
                    {isHovered && (
                        <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                        }}
                        className="d-flex"> 

                            <div className="col mx-2">
                                <a href=""><img src={edit} onClick={openEditModal} style={{height: "20px", width: "20px"}} /></a>
                            </div>
                            {
                            session.role == "manager" ? 
                            (
                                <div className="col">
                                    <a href="" onClick={openDeleteModal}><img src={trash} style={{height: "20px", width: "20px"}} /></a>
                                </div>
                            ) : null
                        }

                        </div>
                    )}
            </div>
        <Modal isOpen={deleteModal} onClose={closeDeleteModal} children={
            <div className="py-2">
                <p style={{lineHeight: "20px"}}>This action is irriversivble and may delete all the containing tasks within</p>
                <div className="text-end mt-5">
                    {!deleteLoading ? <DangerButton children={"Delete task"} onClick={handleDelete} /> : <ButtonLoading /> }
                </div>
            </div>} title="Delete task ?" col="col-3" />




        <Modal isOpen={editModal} onClose={closeEditModal} children={<TaskForm id={id} uid={uid} closeModal={closeEditModal} setFetch={setFetch} setAlert={setAlert} />} title="Quick Edit" col="col-8" />
        
        </>

     );
}
 
export default TaskContainer;