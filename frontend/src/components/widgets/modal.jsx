import { useEffect } from "react";
import Aos from "aos";
import 'aos/dist/aos.css';

const Modal = ({isOpen, onClose, title, children, col}) => {

    useEffect(() => {
        Aos.init({duration: 2000})
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
                    <div className="modal-content" data-aos="fade-down" data-aos-duration="1000" onClick={(e) => e.stopPropagation()}>
                        <div className="row">
                            <div className="col mt-3"><h3>{title}</h3></div>
                            <div className="col">
                                <button className="modal-close fs-1" onClick={onClose}>&times;</button>
                            </div>
                        </div>
                        <hr />
                        {children}
                    </div>
                </div>
            </div> 
        </div>
     );
}
 
export default Modal;