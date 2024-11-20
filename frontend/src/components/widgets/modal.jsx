import { useEffect } from "react";
import Aos from "aos";
import 'aos/dist/aos.css';

const Modal = ({isOpen, onClose, title, children, col}) => {

    useEffect(() => {
        Aos.init({duration: 1000})
    })

    useEffect(() => {
        if(isOpen){
            document.body.style.overflow = "hidden";
        }else{
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        }
    },
    [isOpen]);


    if(!isOpen) return null;

    return ( 
        <div>
            <div className="modal-overlay" onClick={onClose}>
                <div className={col ?? "col-5"}>
                    <div className="modal-content" data-aos="fade-down" data-aos-duration="600" onClick={(e) => e.stopPropagation()}>
                        <div className="p-2">
                            <div className="row mt-2">
                                <div className="col mt-4"><h5 className="text-dark fw-bold">{title}</h5></div>
                                <div className="col">
                                    <button className="modal-close fs-1" onClick={onClose}>&times;</button>
                                </div>
                            </div>
                            {/* <hr /> */}
                            {children}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
     );
}
 
export default Modal;