import { useContext, useEffect, useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { TextAreaFeild, TextFeild } from "../../widgets/textFeilds";
import {  useTaskService } from "../../service/taskService";
import { Loading } from "../../widgets/loading";
import { SessionContext } from "../../context/sessionContext";

const TaskForm = ({closeModal, setLoadingType, status, category, setFetch, setAlert, id}) => {

    function generateUniqueId() {
        const now = Date.now(); // Current time in milliseconds
        const random = Math.floor(Math.random() * 1000); // Random number between 0 and 999
        return `${now}${random}`; // Combine milliseconds and random for uniqueness
    }
    

    const {createTask, fetchTaskById, updateTask} = useTaskService();

    const {session} = useContext(SessionContext);

    const [error, setError] = useState(false);
    const [content, setContent] = useState();
    const [editLoading, setEditLoading] = useState(false);
    const [singledata, setSingleData] = useState({uid: "", title: "", category: ""});

    useEffect(() => {
        const getSingleTask = async () => {
            if(id)
            {
                console.log("The id is present : ", id);
                try{
                    setEditLoading(true);
                    const response = await fetchTaskById(id);
                    if(response.status == "true"){
                        console.log("The response is present : ", response);
                        setSingleData({uid: response.uid, title: response.title, category: response.category});
                        // console.log('DATA is : ', singledata);
                    }
                }catch(error){
                    console.log('Something went wrong  : ', error);
                }finally {
                    setEditLoading(false);

                }
            }
        }

        getSingleTask();
    }, [id])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(content == "" || content == undefined){
            setError(true);
            return;
        }

        const uniqueId = generateUniqueId();

        const data = {
            "uid": uniqueId,
            "activityId": session.activity.uid,
            "ownerId": session.activity.userId,
            "title": content,
            "description": "Testing the app using Jekins",
            "category": category,
            "status": status,
            "dueDate": "2025-02-10T14:30:00",
        };


        
        try{
            setAlert({showMessage: false, messageType: "", message: ""});
            setLoadingType({showLoading: true, type: status});
            const response = await createTask(data);
            console.log('VIEW : ', response);
            if(response.status == "true")
            {
                setAlert({showMessage: true, messageType: "success", message: "New task created"});
                setFetch(true);
                closeModal();
            }else {
                setAlert({showMessage: true, messageType: "fail", message: response.error});
                closeModal();
            }
        }catch(error){
            console.error('Something went wrong: ', error);
        }finally {
            setLoadingType({showLoading: false, type: ""});
        }
    }


    const handleUpdate = async (e) => {
        e.preventDefault();
        if(singledata.title == "" || singledata.title == undefined){
            setError(true);
            return;
        }

        const data = {
            "title": singledata.title,
            "category": singledata.category,
            "status": "true"
        };

        try{
            const response = await updateTask(id, data);
            console.log('VIEW : ', response);
            if(response.status == "true")
            {
                setFetch(true);
                setAlert({showMessage: true, messageType: "success", message: "Data Updated"})
                closeModal();
            }else {
                setAlert({showMessage: true, messageType: "fail", message: response.error});
                closeModal();
            }
        }catch(error){
            console.error('Something went wrong: ', error);
        }


    }

    const handleDefault = (e) => {
        setError(false);
        setContent(e.target.value);
    }

    const handleEdit = (e) => {
        setError(false);
        const newTtitle = e.target.value;
        setSingleData((prevData) => ({
            ...prevData,
            title: newTtitle,
        }))
    }

    return ( 
        <div>
            {editLoading ? (
                <Loading />
            ): (
                <>
                <TextAreaFeild 
                    row={3} 
                    placeholder="Add a task description.." 
                    error={error} 
                    onChange={id ? handleEdit : handleDefault}  
                    value={id ? singledata.title : content}
                    />
                    <div className="footer mt-4 text-end">
                        <PrimaryButton children={!id ? "Save a task" : "Upadate Data"} onClick={id ? handleUpdate : handleSubmit} />
                    </div>
                </>
            )}
        </div>
     );
}
 
export default TaskForm;