import { useContext, useEffect, useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { BordelessTextAreaFeild, BorderlessTextFeild, CheckboxField, SelectField, TextAreaFeild, TextFeild } from "../../widgets/textFeilds";
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
    const [titleError, setTitleError] = useState(false);

    const [content, setContent] = useState();
    const [title, setTitle] = useState();
    const [editLoading, setEditLoading] = useState(false);
    const [singledata, setSingleData] = useState({uid: "", title: "", content: "", category: ""});

    useEffect(() => {
        const getSingleTask = async () => {
            if(id)
            {
                console.log("The id is present : ", id);
                try{
                    setEditLoading(true);
                    const response = await fetchTaskById(id);
                    // if(response.status == "true"){
                        console.log("The response is present : ", response);
                        setSingleData({uid: response.uid, title: response.title, content: response.description, category: response.category});
                        // console.log('DATA is : ', singledata);
                    // }
                }catch(error){
                    console.log('Something went wrong  : ', error);
                    closeModal();
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

        if(title == "" || title == undefined){
            setContent(true);
            return;
        }

        const uniqueId = generateUniqueId();

        const data = {
            "uid": uniqueId,
            "activityId": session.activity != null ? session.activity.uid : null,
            "ownerId": session.activity != null ? session.activity.userId : session.user.userId,
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

        if(singledata.content == "" || singledata.content == undefined){
            setContent(true);
            return;
        }

        const data = {
            "title": singledata.title,
            "description": singledata.content,
            "category": singledata.category,
        };

        try{
            const response = await updateTask(singledata.uid, data);
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
            content: newTtitle,
        }))
    }


    const handleTitleDefault = (e) => {
        setError(false);
        setTitle(e.target.value);
    }

    const handleTitleEdit = (e) => {
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
                <div className="d-flex">
                    <div className="col">
                        <BorderlessTextFeild 
                        placeholder="Add a title"
                        error={titleError} 
                        onChange={id ? handleTitleEdit : handleTitleDefault}  
                        value={id ? singledata.title : title}
                        />
                        <BordelessTextAreaFeild 
                            row={6} 
                            placeholder="Add a task description.." 
                            error={error} 
                            onChange={id ? handleEdit : handleDefault}  
                            value={id ? singledata.content: content}
                            />

                    </div>
                    <div className="col col-5" style={{borderStyle: "solid", borderWidth: "0px 0px 0px 1px"}}>
                        <div className="px-2">
                            <SelectField label="Select a category"   options={[
                                    { label: "low", value: "Low" },
                                    { label: "meduim", value: "Meduim" },
                                    { label: "high", value: "High" }
                                ]} />
                            <br />
                            <h5 className="text-dark">Collaborators</h5>
                            <div className="d-flex">
                                <div className="row">
                                    <div className="col">
                                        {session.collaborators.map((collaborator) => (
                                            <CheckboxField
                                            label={collaborator.username}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer mt-4 text-end">
                    <PrimaryButton children={!id ? "Save a task" : "Upadate Data"} onClick={id ? handleUpdate : handleSubmit} />
                </div>
                </>
            )}
        </div>
     );
}
 
export default TaskForm;