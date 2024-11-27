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
const Home = () => {

    const  {loading, fetchHighTasks, fetchMeduimTasks, fetchLowTasks} = useTaskService();

    const [highModal, setHighModal] = useState(false);
    const [lowModal, setLowModal] = useState(false);
    const [meduimModal, setMeduimModal] = useState(false);

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


    useEffect(() => {



        const getHighData = async () => {
            try{
                const response = await fetchHighTasks();
                setDataHigh(response.data);
                setFetch(false);
                setLoad(false);
            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getMeduimData = async () => {
            try{
                const response = await fetchMeduimTasks();
                console.log('The meduim data is : ', response);
                setDataMeduim(response.data);
                setFetch(false);

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

    return ( 
        <div className="home">
            <div className="row">
                <div className="col">
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
                            {dataHigh && dataHigh.map((data) => (
                                <div className="mb-2">
                                    <TaskContainer child={data.title} color={colors.primaryColor} id={data.id} setFetch={setFetch} setAlert={setAlert} />
                                </div>
                            ))}
                            </>  }
                            
                        </div>
                        } />
                </div>

                <div className="col">
                    <CustomContainer
                    taskLength={dataMeduim.length+" tickets, No task"}
                    loading={load && loading}
                    isModal={meduimModal}
                    title={load && loading ? <Skeleton height={25} /> : "Meduim"}
                    color={load && loading ? colors.greyColor : colors.secondaryColor}
                    closeModal={closeMeduimModal}
                    onClick={openMeduimModal}
                    modalTitle="Meduim task"
                    modalChildren={<TaskForm closeModal={closeMeduimModal} setFetch={setFetch} category="meduim" setAlert={setAlert} />}
                    children={
                        <div>
                            {load && loading ? <div>
                                <Skeleton height={70} /><br />
                                <Skeleton height={70} /><br />
                                <Skeleton height={70} />
                            </div> : 
                                <>
                                {loadingType && loadingType.type == "meduim" ? <div><Skeleton height={70} /><br /></div> : null}
                                {dataMeduim && dataMeduim.map((data) => (
                                    <div className="mb-2">
                                        <TaskContainer child={data.title}  color={colors.secondaryColor} id={data.id} setFetch={setFetch} />
                                    </div>
                                ))}
                                </>}
                        </div>
                        }
                    
                    />
                </div>

                <div className="col">
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
                        {dataLow && dataLow.map((data) => (
                            <div className="mb-2">
                                <TaskContainer child={data.title} id={data.id} setFetch={setFetch} setAlert={setAlert} />
                            </div>
                        ))}
                        </>
                        
                        }
                    </div>
                        
                    }
                    />
                </div>
            </div>
            {alert.showMessage &&  alert.messageType == "success" ? <SuccessMessage onClick={handleCloseMessage} message={alert.message} /> : null}
            {alert.showMessage &&  alert.messageType == "fail" ? <ErrorMessage onClick={handleCloseMessage} message={alert.message} /> : null}
            {/* <ErrorMessage /> */}
        </div>
     );
}
 
export default Home;