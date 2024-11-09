import { colors } from "../tools/color";
import addIcon from "../../assets/add.png";
import { useState } from "react";
import Modal from "./modal";

const CustomContainer = ({children, onClick}) => {

    const [isModal, setIsModal] = useState(false);

    const openModal = () => setIsModal(true);
    const closeModal = () => setIsModal(false);

    return ( 
        <>
        <div className="custom-card">
            <div className="header">
                <div className="row">
                    <div className="col col-1">
                        <div className="small-cont p-2 mt-1" style={{backgroundColor: colors.primaryColor}}></div>
                    </div>
                    <div className="col text-start">
                        <h5 className="fw-bold">High Priority</h5>
                        <p className="">3 tickets, 8 tasks</p>
                    </div>
                    <div className="col text-end"><button onClick={openModal} className="btn icon-btn"><img src={addIcon} className="img-fluid" /></button></div>
                </div>
            </div>
            <hr />
            <div className="content">
                {children}
            </div>
        </div>
        <Modal isOpen={isModal} onClose={closeModal} children={"Hello world"} />
        </>
     );
}
 
export default CustomContainer;