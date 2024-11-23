import { useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { TextAreaFeild, TextFeild } from "../../widgets/textFeilds";
import { userTaskService } from "../../service/taskService";

const HighFeild = ({closeModal}) => {

    function generateUniqueId() {
        const now = Date.now(); // Current time in milliseconds
        const random = Math.floor(Math.random() * 1000); // Random number between 0 and 999
        return `${now}${random}`; // Combine milliseconds and random for uniqueness
    }
    

    const {createTask} = userTaskService();

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
            "category": "high",
            "status": "true"
        };

        
        try{
            const response = await createTask(data);
            console.log('VIEW : ', response);
             closeModal();
        }catch(error){
            console.error('Something went wrong');
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
 
export default HighFeild;