import { colors } from "../tools/color";

const CustomContainer = ({children}) => {
    return ( 
        <div className="custom-card">
            <div className="header">
                <div className="row">
                    <div className="col col-1">
                        <div className="small-cont p-2 mt-1" style={{backgroundColor: colors.primaryColor}}></div>
                    </div>
                    <div className="col text-start">
                        <h5 className="fw-bold">High Priority</h5>
                        <p className="fw-bold">3 tickets, 8 tasks</p>
                    </div>
                    <div className="col text-end"></div>
                </div>
            </div>
            <hr />
            <div className="content">
                {children}
            </div>
        </div>
     );
}
 
export default CustomContainer;