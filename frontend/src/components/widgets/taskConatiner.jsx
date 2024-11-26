import { useState } from "react";
import { colors } from "../tools/color";
import edit from "../../assets/icons/edit.png";
import trash from "../../assets/icons/delete.png";
import Modal from "./modal";
import { DangerButton } from "./button";

const TaskContainer = ({color, child}) => {

    const [isHovered, setIsHovered] = useState(false);

    const [deleteModal, setDeletModal] = useState(false);

    const openDeleteModal = (e) => 
        {
            e.preventDefault();
            setDeletModal(true)
        };
    const closeDeleteModal = () => setDeletModal(false);


    return ( 
        <>
            <div className="task-container" 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{borderColor: color ?? colors.grey2Color, padding: "10px", position: "relative", borderRadius: "5px" }}>                
                    <h6> {child}</h6>
                    <p>Task 2</p>
                    {isHovered && (
                        <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                        }}
                        className="d-flex"> 
                            <div className="col mx-2">
                                <a href=""><img src={edit} style={{height: "20px", width: "20px"}} /></a>
                            </div>
                            <div className="col">
                                <a href="" onClick={openDeleteModal}><img src={trash} style={{height: "20px", width: "20px"}} /></a>
                            </div>
                        </div>
                        // <Dropdown label="&#8942;" style={
                        //     {
                        //         position: "absolute",
                        //         top: "10px",
                        //         right: "10px",
                        //         cursor: "pointer",
                        //     }
                        // } items={["Quick edit", "Delete"]} />
                    )}
            </div>
        <Modal isOpen={deleteModal} onClose={closeDeleteModal} children={
            <div className="py-2">
                <p style={{lineHeight: "20px"}}>This action is irriversivble and may delete all the containing tasks within</p>
                <div className="text-end mt-5">
                    <DangerButton children="Delete task" />
                </div>
            </div>} title="Delete task ?" col="col-3" />
        </>

     );
}
 
export default TaskContainer;