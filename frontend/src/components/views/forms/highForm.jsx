import { useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { TextAreaFeild, TextFeild } from "../../widgets/textFeilds";

const HighFeild = ({closeModal}) => {

    const [error, setError] = useState(false);
    const [content, setContent] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('The content here is : ', content);
        if(content == "" || content == undefined){
            setError(true);
            return;
        }
        closeModal();
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