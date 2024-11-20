import { colors } from "../tools/color";
import addIcon from "../../assets/icons/add.png";
import { useState } from "react";
import Modal from "./modal";

const CustomContainer = ({ isModal, closeModal, title, children, onClick, color, modalTitle, modalChildren}) => {


    return ( 
        <>
        <div className="custom-card">
            <div className="header">
                <div className="row">
                    <div className="col col-1">
                        <div className="small-cont p-2 mt-1" style={{backgroundColor: color ?? colors.grey2Color}}></div>
                    </div>
                    <div className="col text-start">
                        <h5 className="fw-bold">{title}</h5>
                        <p className="">3 tickets, 8 tasks</p>
                    </div>
                    <div className="col text-end"><button onClick={onClick} className="btn icon-btn"><img src={addIcon} className="img-fluid" /></button></div>
                <hr />

                </div>
            </div>
            <div className="content">
                {children}
            </div>
        </div>
        <Modal isOpen={isModal} onClose={closeModal} children={modalChildren} title={modalTitle} col="col-4" />
        </>
     );
}
 
export default CustomContainer;