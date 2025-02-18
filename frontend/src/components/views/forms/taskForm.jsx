import { useContext, useEffect, useState } from "react";
import { PrimaryButton } from "../../widgets/button";
import { BordelessTextAreaFeild, BorderlessTextFeild, CheckboxField, SelectField, TextAreaFeild, TextFeild } from "../../widgets/textFeilds";
import {  useTaskService } from "../../service/taskService";
import { ButtonLoading, Loading } from "../../widgets/loading";
import { SessionContext } from "../../context/sessionContext";

const TaskForm = ({closeModal, setLoadingType, status, setFetch, setAlert, id, uid}) => {

    function generateUniqueId() {
        const now = Date.now(); // Current time in milliseconds
        const random = Math.floor(Math.random() * 1000); // Random number between 0 and 999
        return `${now}${random}`; // Combine milliseconds and random for uniqueness
    }
    

    const {createTask, getAssignCollaboratorsByUid, fetchTaskById, updateTask, getActiveCollaborators, loading} = useTaskService();

    const {session} = useContext(SessionContext);

    const uniqueId = generateUniqueId();

    const [taskUid, setTaskUid] = useState();

    const [error, setError] = useState(false);
    const [titleError, setTitleError] = useState(false);

    const [content, setContent] = useState();
    const [title, setTitle] = useState();
    const [catgory, setCategory] = useState("low");
    const [selectedCollaborators, setSelectedCollaborators] = useState([]);
    const [assignedCollaborators, setAssignedCollaborators] = useState([]);


    const [editLoading, setEditLoading] = useState(id ? true : false);
    const [singledata, setSingleData] = useState({uid: "", title: "", content: "", category: ""});

    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        console.log("The uid here is ---> ", uid);
    setTaskUid(uniqueId);
        const getSingleTask = async () => {
            if(id)
            {
                console.log("The id is present : ", id);
                try{
                    setEditLoading(true);
                    const response = await fetchTaskById(id);
                    // if(response.status == "true"){
                        console.log("The response is single : ", response);
                        setCategory(response.category);
                        setSingleData({uid: response.uid, title: response.title, content: response.description, category: response.category});
                        // console.log('DATA is : ', singledata);
                    // }
                }catch(error){
                    console.log('Something went wrong  : ', error);
                    closeModal();
                }
            }
        }

        const getAllActiveCollaborators = async () =>{
            try{
                const response = await getActiveCollaborators(session.user.userId);
                console.log("The active collaborators -> ", response);
                setCollaborators(response.data);

                const response2 = await getAssignCollaboratorsByUid(uid);
                console.log("The assigned --> ", response2);
                setAssignedCollaborators(response2.data);
            }catch(error){
                console.log("The active collabporators ain't there --> ", error.message);
            }finally {
                setEditLoading(false);

            }
        } 

        getSingleTask();
        getAllActiveCollaborators();
    }, [id]);





    const handleCheckboxChange = (collaborator) => {
        setAssignedCollaborators((prevSelected) => {
            let updatedSelection;
    
            if (prevSelected.some((item) => item.userActivityUid === collaborator.uid)) {
                // If already selected, remove it
                updatedSelection = prevSelected.filter((item) => item.userActivityUid !== collaborator.uid);
            } else {
                // Otherwise, add it
                const data = {
                    uid: uniqueId,
                    taskUid: taskUid,
                    userActivityUid: collaborator.uid,
                    status: "true",
                };
                updatedSelection = [...prevSelected, data];
            }
    
            console.log("Updated Assigned Collaborators:", updatedSelection);
            return updatedSelection;
        });
    };

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


        const data = {
            "uid": taskUid,
            "activityId": session.activity != null ? session.activity.uid : null,
            "ownerId": session.activity != null ? session.activity.userId : session.user.userId,
            "title": title,
            "description": content,
            "category": catgory,
            "status": status,
            "dueDate": "2025-02-10T14:30:00",
            "assigned": assignedCollaborators
        };

        console.log("The data her is --> ", data);
        
        try{
            setAlert({showMessage: false, messageType: "", message: ""});
            // setLoadingType({showLoading: true, type: status});
            const response = await createTask(data);
            console.log('VIEW : ', response);
            if(response.status == "true")
            {
                setAlert({showMessage: true, messageType: "success", message: "New task created"});
                setFetch(true);
                closeModal();
            }else if(response == undefined) {
                setAlert({showMessage: true, messageType: "fail", message: response.error});
                closeModal();
            }else{
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
            "uid": singledata.uid,
            "activityId": session.activity != null ? session.activity.uid : null,
            "ownerId": session.activity != null ? session.activity.userId : session.user.userId,
            "title": singledata.title,
            "description": singledata.content,
            "category": singledata.category,
            "status": status,
            "dueDate": "2025-02-10T14:30:00",
            "assigned": assignedCollaborators

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
                            maxLength={250}
                            row={6} 
                            placeholder="Add a task description.." 
                            error={error} 
                            onChange={id ? handleEdit : handleDefault}  
                            value={id ? singledata.content: content}
                            />

                    </div>
                    <div className="col col-5" style={{borderStyle: "solid", borderWidth: "0px 0px 0px 1px"}}>
                        <div className="px-2">
                            <h5 className="fs-5 mb-2 text-dark"> Category</h5>
                            <SelectField label="Select a category" value={catgory} onChange={(e) => setCategory(e.target.value)}  options={[
                                    { label: "Low", value: "low" },
                                    { label: "Meduim", value: "meduim" },
                                    { label: "High", value: "high" }
                                ]} />
                            <br />
                            <h5 className="text-dark">Collaborators</h5>
                            <div className="d-flex">
                                <div className="row">
                                    <div className="col">
                                        {collaborators && collaborators.map((collaborator) => (
                                            <CheckboxField
                                            checked={uid && (assignedCollaborators && assignedCollaborators.some((col) => col.userActivityUid == collaborator.uid))}
                                            label={`${collaborator.username} ${collaborator.uid == session.user.userId ? "(You)" : ""}`}
                                            onChange={() => handleCheckboxChange(collaborator)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer mt-4 text-end">
                    {loading ? <ButtonLoading /> : <PrimaryButton children={!id ? "Save a task" : "Upadate Data"} onClick={id ? handleUpdate : handleSubmit} /> }
                </div>
                </>
            )}
        </div>
     );
}
 
export default TaskForm;