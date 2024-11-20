import Aos from "aos"
import { useEffect } from "react"
import { colors } from "../tools/color"

import ok from "../../assets/icons/messages/ok.png";
import error from "../../assets/icons/messages/error.png"

const SuccessMessage = ({onClick}) => {
    useEffect(() => {
        Aos.init({duration: 2000})
    })

    return (
        <div className="alert notif"  data-aos-delay="100" data-aos-duration="1000" style={{borderColor: colors.primaryColor}}>
            <div className="d-flex">
                <div className="col col-1"><img src={ok} className="img-fluid px-lg-0 px-1 mt-2" style={{height: "auto", width: "470px"}} /></div>
                <div className="col text-scondary text-start">
                <div className=" mx-3"><label className="fw-bold" style={{color: colors.primaryColor}}>Done</label><br />  The Message has been saved</div>
                </div>
                <div className="col col-2 text-end mt-3">
                <button type="button" className="btn-close mb-1" aria-label="Close" onClick={onClick}></button>
                </div>
            </div>
        </div>
    )
}


const ErrorMessage = ({onClick}) => {
    useEffect(() => {
        Aos.init({duration: 2000})
    })

    return (
        <div className="alert notif"  data-aos-delay="100" data-aos-duration="1000" style={{borderColor: colors.dangerColor}}>
            <div className="d-flex">
                <div className="col col-1"><img src={error} className="img-fluid px-lg-0 px-1 mt-2" style={{height: "auto", width: "470px"}} /></div>
                <div className="col text-scondary text-start">
                <div className=" mx-3"><label className="fw-bold" style={{color: colors.dangerColor}}>Error</label><br />  Something went wrong</div>
                </div>
                <div className="col col-2 text-end mt-3">
                <button type="button" className="btn-close mb-1" aria-label="Close" onClick={onClick}></button>
                </div>
            </div>
        </div>
    )
}


export {SuccessMessage, ErrorMessage}