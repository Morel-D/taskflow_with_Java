import { useEffect, useState } from "react";
import { colors } from "../tools/color";
import CustomContainer from "../widgets/customConatiner";
import TaskContainer from "../widgets/taskConatiner";
import HighFeild from "./forms/taskForm";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ErrorMessage, SuccessMessage } from "../widgets/message";
import { useApiServce } from "../service/apiService";
import TaskForm from "./forms/taskForm";
import { useTaskService } from "../service/taskService";
import AddTaskContainer from "../widgets/addTaskConatiner";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../widgets/StrictModelDroppable";
import NoNetwork from "../widgets/noNetwork";
const Home = () => {

    const  {loading, fetchHighTasks, fetchMeduimTasks, fetchLowTasks, updateTask} = useTaskService();

    const [highModal, setHighModal] = useState(false);
    const [lowModal, setLowModal] = useState(false);
    const [meduimModal, setMeduimModal] = useState(false);
    const [network, setNetwork] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, messageType: "", message: ""});
    const [fetch, setFetch] = useState(false);
    const [loadingType, setLoadingType] = useState({showLoading: false, type: ""});
    const [load, setLoad] = useState(true);

    const [dataHigh, setDataHigh] = useState([]);
    const [dataMeduim, setDataMeduim] = useState([]);
    const [dataLow, setDataLow] = useState([]);




    const openHighModal = () => setHighModal(true);
    const closeHighModal = () => setHighModal(false);

    const openLowModal = () => setLowModal(true);
    const closeLowModal = () => setLowModal(false);

    const openMeduimModal = () => setMeduimModal(true);
    const closeMeduimModal = () => setMeduimModal(false);


    const handleReload = async () => {


        const getHighData = async () => {
            try{
                const response = await fetchHighTasks();
                setDataHigh(response.data);
                setFetch(false);
                setLoad(false);
            }catch(error){
                console.log('Smething went wrong : ', error.code);
            }
        }

        const getMeduimData = async () => {
            try{
                const response = await fetchMeduimTasks();
                console.log('The meduim data is : ', response);
                if(response == "ERR_NETWORK"){
                    setNetwork(true)
                }else{
                    setNetwork(false);
                    setDataMeduim(response.data);
                    setFetch(false);
                }


            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getLowData = async () => {
            try{
                const response = await fetchLowTasks();
                // console.log('The data is : ', response);
                setDataLow(response.data);
                setFetch(false);

            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }
        
        getHighData();
        getMeduimData();
        getLowData();

    }


    useEffect(() => {



        const getHighData = async () => {
            try{
                const response = await fetchHighTasks();
                setDataHigh(response.data);
                setFetch(false);
                setLoad(false);
            }catch(error){
                console.log('Smething went wrong : ', error.code);
            }
        }

        const getMeduimData = async () => {
            try{
                const response = await fetchMeduimTasks();
                console.log('The meduim data is : ', response);
                if(response == "ERR_NETWORK"){
                    setNetwork(true)
                }else{
                    setNetwork(false);
                    setDataMeduim(response.data);
                    setFetch(false);
                }


            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getLowData = async () => {
            try{
                const response = await fetchLowTasks();
                // console.log('The data is : ', response);
                setDataLow(response.data);
                setFetch(false);

            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }
        
        getHighData();
        getMeduimData();
        getLowData();

    }, [fetch])


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


        if(source.droppableId == "high"){
            const draggedTask = dataHigh.find((task) => task.id.toString() === draggableId);
            tasktitle = draggedTask.title;
        }
        if(source.droppableId == "meduim"){
            const draggedTask = dataMeduim.find((task) => task.id.toString() === draggableId);
            tasktitle = draggedTask.title;

        }
        if(source.droppableId == "low"){
            const draggedTask = dataLow.find((task) => task.id.toString() === draggableId);
            tasktitle = draggedTask.title;

        }
    
        // Perform actions based on the droppableId
        if (source.droppableId != destination.droppableId) {
            try{
                setLoadingType({showLoading: true, type: destination.droppableId});
                const response = await updateTask(draggableId, {'title':  tasktitle,  'category': destination.droppableId, 'status': 'true'});
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
      {network == true ? 
        <NoNetwork onClick={handleReload} /> :
        (
            <DragDropContext onDragEnd={handleDragEnd} >

            <div className="row">
                <StrictModeDroppable droppableId="high">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="col"
                        >
                            {/* <AddTaskContainer children={provided.placeholder} /> */}
                            <CustomContainer
                            taskLength={dataHigh.length+" tickets,  No task"}
                            loading={load && loading}
                            isModal={highModal}
                            title={load && loading ? <Skeleton height={25} /> : "High Priority"}
                            color={load && loading ? colors.greyColor : colors.primaryColor}
                            closeModal={closeHighModal}
                            onClick={openHighModal}
                            modalTitle="High Priority Task"
                            modalChildren={<TaskForm closeModal={closeHighModal} setFetch={setFetch} setLoadingType={setLoadingType} category="high" setAlert={setAlert} />}
                            children={
                                <div>
                                    {load && loading ? <div>
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} />
                                    </div> : 
                                    
                                    <>
                                    {loadingType && loadingType.type == "high" ? <div><Skeleton height={70} /><br /></div> : null}
                                    {dataHigh && dataHigh.map((data, index) => (
                                        <Draggable key={data.id} draggableId={data.id.toString()} index={index} >
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
                                                    <TaskContainer child={data.title} color={colors.primaryColor} id={data.id} setFetch={setFetch} setAlert={setAlert} />
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

                <StrictModeDroppable droppableId="meduim" >
                    {(provided) => (
                        <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="col">
                            {/* <AddTaskContainer children={provided.placeholder} /> */}

                            <CustomContainer
                            taskLength={dataMeduim.length+" tickets, No task"}
                            loading={load && loading}
                            isModal={meduimModal}
                            title={load && loading ? <Skeleton height={25} /> : "Meduim"}
                            color={load && loading ? colors.greyColor : colors.secondaryColor}
                            closeModal={closeMeduimModal}
                            onClick={openMeduimModal}
                            modalTitle="Meduim task"
                            modalChildren={<TaskForm closeModal={closeMeduimModal} setFetch={setFetch} setLoadingType={setLoadingType} category="meduim" setAlert={setAlert} />}
                            children={
                                <div>
                                    {load && loading ? <div>
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} /><br />
                                        <Skeleton height={70} />
                                    </div> : 
                                        <>
                                        {loadingType && loadingType.type == "meduim" ? <div><Skeleton height={70} /><br /></div> : null}
                                        {dataMeduim && dataMeduim.map((data, index) => (
                                            <Draggable key={data.id} draggableId={data.id.toString()} index={index} >
                                                {(provided) => (
                                                    <div 
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}                                                        
                                                    className="mb-2">
                                                        <TaskContainer child={data.title}  color={colors.secondaryColor} id={data.id} setFetch={setFetch}  setAlert={setAlert} />
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

                <StrictModeDroppable droppableId="low">
                    {(provided) => (
                        <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="col">
                            <CustomContainer 
                            taskLength={dataLow.length+" tickets, No task"}
                            loading={load && loading}
                            isModal={lowModal}
                            title={load && loading ? <Skeleton height={25} /> : "Low"}
                            color={load && loading ? colors.greyColor : colors.grey2Color}
                            closeModal={closeLowModal}
                            onClick={openLowModal}
                            modalTitle="Low task"
                            modalChildren={<TaskForm closeModal={closeLowModal} setFetch={setFetch} setLoadingType={setLoadingType} category="low" setAlert={setAlert} />}
                            children={
                                <div>
                                {load && loading ? <div>
                                    <Skeleton height={70} /><br />
                                    <Skeleton height={70} /><br />
                                    <Skeleton height={70} />
                                </div> : 
                                <>
                                {loadingType && loadingType.type == "low" ? <div><Skeleton height={70} /><br /></div> : null}
                                {dataLow && dataLow.map((data, index) => (
                                    <Draggable key={data.id} draggableId={data.id.toString()} index={index} >
                                        {(provided) => (
                                            <div 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}  
                                            className="mb-2">
                                                <TaskContainer child={data.title} id={data.id} setFetch={setFetch} setAlert={setAlert} />
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
     );
}
 
export default Home;