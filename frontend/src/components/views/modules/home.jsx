import { useContext, useEffect, useState } from "react";
import { colors } from "../../tools/color";
import CustomContainer from "../../widgets/customConatiner";
import TaskContainer from "../../widgets/taskConatiner";
import HighFeild from "../forms/taskForm";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ErrorMessage, SuccessMessage } from "../../widgets/message";
import { useApiServce } from "../../service/apiService";
import TaskForm from "../forms/taskForm";
import { useTaskService } from "../../service/taskService";
import AddTaskContainer from "../../widgets/addTaskConatiner";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../../widgets/StrictModelDroppable";
import NoNetwork from "../../widgets/noNetwork";
import { SessionContext } from "../../context/sessionContext";
import { capitalizeFirstLetter } from "../../utils/helper";
import empty from "../../../assets/icons/empty.png";
import { PrimaryButton } from "../../widgets/button";

const Home = () => {

    const  {loading, fetchTodoTasks, fetchProgressTasks, fetchDoneTasks, updateTask} = useTaskService();

    const [todoModal, setTodoModal] = useState(false);
    const [doneModal, setDoneModal] = useState(false);
    const [progressModal, setProgressModal] = useState(false);
    const [network, setNetwork] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, messageType: "", message: ""});
    const [fetch, setFetch] = useState(false);
    const [loadingType, setLoadingType] = useState({showLoading: false, type: ""});
    const [load, setLoad] = useState(true);

    const [dataTodo, setDataTodo] = useState([]);
    const [dataProgress, setDataProgress] = useState([]);
    const [dataDone, setDataDone] = useState([]);

    const [tasks, setTask] = useState(0);




    const openTodoModal = () => setTodoModal(true);
    const closeTodoModal = () => setTodoModal(false);

    const openDoneModal = () => setDoneModal(true);
    const closeDoneModal = () => setDoneModal(false);

    const openProgressModal = () => setProgressModal(true);
    const closeProgressModal = () => setProgressModal(false);


    const handleReload = async () => {


        const getTodoData = async () => {
            try{
                const response = await fetchTodoTasks();
                setDataTodo(response.data);
                setFetch(false);
                setLoad(false);
            }catch(error){
                console.log('Smething went wrong : ', error.code);
            }
        }

        const getProgressData = async () => {
            try{
                const response = await fetchProgressTasks();
                console.log('The meduim data is : ', response);
                if(response == "ERR_NETWORK"){
                    setNetwork(true)
                }else{
                    setNetwork(false);
                    setDataProgress(response.data);
                    setFetch(false);
                }


            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getDoneData = async () => {
            try{
                const response = await fetchDoneTasks();
                // console.log('The data is : ', response);
                setDataDone(response.data);
                setFetch(false);

            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }
        
        getTodoData();
        getProgressData();
        getDoneData();

        setTask(dataTodo.length + dataProgress.length + dataDone.length);

    }


    useEffect(() => {

        

        const getTodoData = async () => {
            try{
                const response = await fetchTodoTasks();
                console.log('The todo data is : ', response);

                setDataTodo(response.data);
                setFetch(false);
                setLoad(false);
            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getProgressData = async () => {
            try{
                const response = await fetchProgressTasks();
                // console.log('The meduim data is : ', response);
                if(response == "ERR_NETWORK"){
                    setNetwork(true)
                }else{
                    setNetwork(false);
                    setDataProgress(response.data);
                    setFetch(false);
                }


            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getDoneData = async () => {
            try{
                const response = await fetchDoneTasks();
                // console.log('The data is : ', response);
                setDataDone(response.data);
                setFetch(false);

            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }
        
        getTodoData();
        getProgressData();
        getDoneData();

        setTask(dataTodo.length + dataProgress.length + dataDone.length);

    }, [fetch, tasks])


    useEffect(() => {
        console.log('The general laoding is : ', load);
        console.log("The alert is : ", alert)
    }, [alert])
    
    const handleCloseMessage = () => {
        setAlert({showMessage: false, messageType: "", message: ""});
    }

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        let tasktitle;


        console.log("Draggable key (id):", draggableId);

        // If the item was not dropped in a valid destination
        if (!destination) {
            console.log("Dropped outside of any droppable");
            return;
        }
    
        // Log the source and destination droppableIds
        console.log("Dragged from droppableId:", source.droppableId);
        console.log("Dropped into droppableId:", destination.droppableId);


        if(source.droppableId == "todo"){
            const draggedTask = dataTodo.find((task) => task.id.toString() === draggableId);
            // tasktitle = draggedTask.title;
        }
        if(source.droppableId == "progress"){
            const draggedTask = dataProgress.find((task) => task.id.toString() === draggableId);
            // tasktitle = draggedTask.title;

        }
        if(source.droppableId == "done"){
            const draggedTask = dataDone.find((task) => task.id.toString() === draggableId);
            // tasktitle = draggedTask.title;

        }
    
        // Perform actions based on the droppableId
        if (source.droppableId != destination.droppableId) {
            try{
                setLoadingType({showLoading: true, type: destination.droppableId});
                const response = await updateTask(draggableId, {'status': destination.droppableId});
                console.log('response is : ', response);
                if(response.status == "true")
                {
                    setFetch(true);
                    setAlert({showMessage: true, messageType: "success", message: "Data Updated"})
                }
            }catch(error){
                console.error('Something went wrong: ', error);
            }finally{
                setLoadingType({showLoading: false, type: ""});
            }
        } else {
            console.log(`Reordered within ${source.droppableId}`);
            // Handle logic for reordering within the same container
        }
    }


    return ( 
      <>
        <div className="row">
            <div className="col">
                <h3 className="fw-bold" style={{color: colors.secondaryColor}}>Tasks</h3>
            </div>
            <div className="col">

            </div>

            {tasks == 0 ? 
            (
                <div className="text-center mt-5">
                    <img src={empty} className="img-fluid mt-5" style={{height: "10rem"}} />
                    <p className="fs-2 text-dark mb-5">No record found</p>
                    <PrimaryButton children="Add a task" onClick={openDoneModal} />
                </div>
            ):

            (
                <>
                  {network == true ? 
        <NoNetwork onClick={handleReload} /> :
        (
            <DragDropContext onDragEnd={handleDragEnd} >

            <div className="row">
                <StrictModeDroppable droppableId="todo">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="col"
                        >
                            {/* <AddTaskContainer children={provided.placeholder} /> */}
                            <CustomContainer
                            taskLength={dataTodo.length > 1 ? dataTodo.length+" tasks": dataTodo.length+" task"}
                            loading={load && loading}
                            isModal={todoModal}
                            title={load && loading ? <Skeleton height={25} /> : "Todo"}
                            color={load && loading ? colors.greyColor : colors.grey2Color}
                            closeModal={closeTodoModal}
                            onClick={openTodoModal}
                            modalTitle="Todo Task"
                            modalChildren={<TaskForm closeModal={closeTodoModal} setFetch={setFetch} setLoadingType={setLoadingType} status="todo" setAlert={setAlert} />}
                            children={
                                <div>
                                    {load && loading ? <div>
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} />
                                    </div> : 
                                    
                                    <>
                                    {loadingType && loadingType.type == "todo" ? <div><Skeleton height={70} /><br /></div> : null}
                                    {dataTodo && dataTodo.map((data, index) => (
                                        <Draggable key={data.id} draggableId={data.uid.toString()} index={index} >
                                            {(provided, snapshot) => (
                                                <div 
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    opacity: snapshot.isDragging ? 0.8 : 1,
                                                }}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="mb-2">
                                                    <TaskContainer
                                                    num={data.assigned.length}
                                                    category={capitalizeFirstLetter(data.category)}
                                                    categoryClassName={data.category == "low" ? "low-active-badge" : data.category == "meduim" ? "meduim-active-badge" : "high-active-badge"} 
                                                    child={data.title} 
                                                    content={data.description} 
                                                    id={data.id} 
                                                    uid={data.uid.toString()}
                                                    setFetch={setFetch} 
                                                    setAlert={setAlert} />
                                                </div>
                                            )}

                                        </Draggable>
                                    ))}
                                    </>  }
                                    
                                </div>
                                } />
                    </div>
                    )}
                </StrictModeDroppable>

                <StrictModeDroppable droppableId="progress" >
                    {(provided) => (
                        <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="col">

                            <CustomContainer
                            taskLength={dataProgress.length > 1 ? dataProgress.length+" tasks" :dataProgress.length+" task" }
                            loading={load && loading}
                            isModal={progressModal}
                            title={load && loading ? <Skeleton height={25} /> : "In-Progess"}
                            color={load && loading ? colors.greyColor : colors.secondaryColor}
                            closeModal={closeProgressModal}
                            onClick={openProgressModal}
                            modalTitle="In-Progess task"
                            modalChildren={<TaskForm closeModal={closeProgressModal} setFetch={setFetch} setLoadingType={setLoadingType} status="progress" setAlert={setAlert} />}
                            children={
                                <div>
                                    {load && loading ? <div>
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} />
                                    </div> : 
                                        <>
                                        {loadingType && loadingType.type == "progress" ? <div><Skeleton height={70} /><br /></div> : null}
                                        {dataProgress && dataProgress.map((data, index) => (
                                            <Draggable key={data.id} draggableId={data.uid.toString()} index={index} >
                                                {(provided) => (
                                                    <div 
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}                                                        
                                                    className="mb-2">
                                                        <TaskContainer
                                                        num={data.assigned.length}
                                                        category={capitalizeFirstLetter(data.category)}
                                                        categoryClassName={data.category == "low" ? "low-active-badge" : data.category == "meduim" ? "meduim-active-badge" : "high-active-badge"}                                                          
                                                        child={data.title} 
                                                        content={data.description}   
                                                        color={colors.secondaryColor} 
                                                        id={data.id} 
                                                        uid={data.uid}
                                                        setFetch={setFetch}  
                                                        setAlert={setAlert} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        </>}
                                </div>
                                }
                            
                            />
                        </div>
                    )}
                </StrictModeDroppable>

                <StrictModeDroppable droppableId="done">
                    {(provided) => (
                        <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="col">
                            <CustomContainer 
                            taskLength={dataDone.length > 1 ? dataDone.length+" tasks" : dataDone.length+" task"}
                            loading={load && loading}
                            isModal={doneModal}
                            title={load && loading ? <Skeleton height={25} /> : "Done"}
                            color={load && loading ? colors.greyColor : colors.primaryColor}
                            closeModal={closeDoneModal}
                            onClick={openDoneModal}
                            modalTitle="Done task"
                            modalChildren={<TaskForm closeModal={closeDoneModal} setFetch={setFetch} setLoadingType={setLoadingType}  status="done" setAlert={setAlert} />}
                            children={
                                <div>
                                {load && loading ? <div>
                                    <Skeleton height={70} /><br />
                                    <Skeleton height={70} /><br />
                                    <Skeleton height={70} />
                                </div> : 
                                <>
                                {loadingType && loadingType.type == "done" ? <div><Skeleton height={70} /><br /></div> : null}
                                {dataDone && dataDone.map((data, index) => (
                                    <Draggable key={data.id} draggableId={data.uid.toString()} index={index} >
                                        {(provided) => (
                                            <div 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}  
                                            className="mb-2">
                                                <TaskContainer
                                                num={data.assigned.length}
                                                category={capitalizeFirstLetter(data.category)}
                                                categoryClassName={data.category == "low" ? "low-active-badge" : data.category == "meduim" ? "meduim-active-badge" : "high-active-badge"}                                                  
                                                child={data.title} 
                                                content={data.description}   
                                                color={colors.primaryColor} 
                                                id={data.id} 
                                                uid={data.uid}
                                                setFetch={setFetch} 
                                                setAlert={setAlert} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                </>
                                
                                }
                            </div>
                                
                            }
                            />
                        </div>
                    )}
                </StrictModeDroppable>

            </div>
            {alert.showMessage &&  alert.messageType == "success" ? <SuccessMessage onClick={handleCloseMessage} message={alert.message} /> : null}
            {alert.showMessage &&  alert.messageType == "fail" ? <ErrorMessage onClick={handleCloseMessage} message={alert.message} /> : null}
            {/* <ErrorMessage /> */}
    </DragDropContext>
        )
        }
                </>
            )
        
        }
         
        </div>
      </>
     );
}
 
export default Home;