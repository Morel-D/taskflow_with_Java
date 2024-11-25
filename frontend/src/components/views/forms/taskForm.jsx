import { useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { TextAreaFeild, TextFeild } from "../../widgets/textFeilds";
import {  useTaskService } from "../../service/taskService";

const TaskForm = ({closeModal, setLoadingType, category, setFetch, setAlert}) => {

    function generateUniqueId() {
        const now = Date.now(); // Current time in milliseconds
        const random = Math.floor(Math.random() * 1000); // Random number between 0 and 999
        return `${now}${random}`; // Combine milliseconds and random for uniqueness
    }
    

    const {createTask} = useTaskService();

    const [error, setError] = useState(false);
    const [content, setContent] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(content == "" || content == undefined){
            setError(true);
            return;
        }

        const uniqueId = generateUniqueId();

        const data = {
            "uid": uniqueId,
            "title": content,
            "category": category,
            "status": "true"
        };

        
        try{
            setAlert({showMessage: false, messageType: "", message: ""});
            setLoadingType({showLoading: true, type: category});
            const response = await createTask(data);
            console.log('VIEW : ', response);
            if(response.status == "true")
            {
                setAlert({showMessage: true, messageType: "success", message: "New task created"});
                setFetch(true);
                closeModal();
            }else {
                setAlert({showMessage: true, messageType: "fail", message: response});
                closeModal();
            }
        }catch(error){
            console.error('Something went wrong: ', error);
        }finally {
            setLoadingType({showLoading: false, type: ""});
        }
    }

    const handleDefault = (e) => {
        setError(false);
        setContent(e.target.value);
    }

    return ( 
        <div>
            <TextAreaFeild 
            row={3} 
            placeholder="Add a task description.." 
            error={error} 
            onChange={handleDefault}  
            value={content}
            />
            <div className="footer mt-4 text-end">
                <PrimaryButton children="Save a task" onClick={handleSubmit} />
            </div>
        </div>
     );
}
 
export default TaskForm;