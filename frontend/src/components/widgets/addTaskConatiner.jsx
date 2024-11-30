import addIcon from "../../assets/icons/add.png";

const AddTaskContainer = ({children}) => {
    return ( 
        <div className="mb-4">
           <div className="add-container text-center">
                <img src={addIcon} className="img-fluid" style={{height: "50px"}} />
                <p className="fw-bold mt-1">Drop Here</p>
                <div style={{display: 'none', backgroundColor: 'red'}}>{children}</div>
           </div>
        </div>
     );
}
 
export default AddTaskContainer;