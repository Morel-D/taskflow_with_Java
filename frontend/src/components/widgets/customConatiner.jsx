import { colors } from "../tools/color";
import addIcon from "../../assets/icons/add.png";
import { useState } from "react";
import Modal from "./modal";
import Skeleton from "react-loading-skeleton";

const CustomContainer = ({ isModal, closeModal, title, children, onClick, color, modalTitle, modalChildren, loading, taskLength}) => {


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
                         {loading ? <Skeleton height={15} /> : <p className="">{taskLength}</p>} 
                    </div>
                    <div className="col text-end">
                        {loading ? <div className="mt-2"><Skeleton circle width={30} height={30} /></div> : <button onClick={onClick} className="btn icon-btn"><img src={addIcon} className="img-fluid" /></button>}
                    </div>
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