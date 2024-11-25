import { useEffect, useState } from "react";
import { colors } from "../tools/color";
import CustomContainer from "../widgets/customConatiner";
import TaskContainer from "../widgets/taskConatiner";
import HighFeild from "./forms/taskForm";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ErrorMessage, SuccessMessage } from "../widgets/message";
import { useApiServce } from "../service/apiService";
import Loading from "../widgets/loading";
import TaskForm from "./forms/taskForm";
import { useTaskService } from "../service/taskService";
const Home = () => {

    const  {loading, fetchHighTasks, fetchMeduimTasks, fetchLowTasks} = useTaskService();

    const [highModal, setHighModal] = useState(false);
    const [lowModal, setLowModal] = useState(false);
    const [meduimModal, setMeduimModal] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, messageType: "", message: ""});
    const [fetch, setFetch] = useState({fetchData: false, fetchType: ""});

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
            setAlert({showMessage: false, messageType: "", message: ""});

            try{
                const response = await fetchHighTasks();
                // console.log('The data is : ', response);
                setDataHigh(response.data);
            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getMeduimData = async () => {
            setAlert({showMessage: false, messageType: "", message: ""});

            try{
                const response = await fetchMeduimTasks();
                console.log('The meduim data is : ', response);
                setDataMeduim(response.data);
            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }

        const getLowData = async () => {
            setAlert({showMessage: false, messageType: "", message: ""});

            try{
                const response = await fetchLowTasks();
                // console.log('The data is : ', response);
                setDataLow(response.data);
            }catch(error){
                console.log('Smething went wrong : ', error);
            }
        }
        
        getHighData();
        getMeduimData();
        getLowData();

    }, [])


    useEffect(() => {
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
                    loading={loading}
                    isModal={highModal}
                    title={loading ? <Skeleton height={25} /> : "High Priority"}
                    color={loading ? colors.greyColor : colors.primaryColor}
                    closeModal={closeHighModal}
                    onClick={openHighModal}
                    modalTitle="High Priority Task"
                    modalChildren={<TaskForm closeModal={closeHighModal} category="high" setAlert={setAlert} />}
                    children={
                        <div>
                            {loading ? <div>
                                <Skeleton height={70} /><br />
                                <Skeleton height={70} /><br />
                                <Skeleton height={70} />
                            </div> : 
                            
                            <>
                            {dataHigh && dataHigh.map((data) => (
                                <div className="mb-2">
                                    <TaskContainer child={data.title} color={colors.primaryColor} />
                                </div>
                            ))}
                            </>  }
                            
                        </div>
                        } />
                </div>

                <div className="col">
                    <CustomContainer
                    loading={loading}
                    isModal={meduimModal}
                    title={loading ? <Skeleton height={25} /> : "Meduim"}
                    color={loading ? colors.greyColor : colors.secondaryColor}
                    closeModal={closeMeduimModal}
                    onClick={openMeduimModal}
                    modalTitle="Meduim task"
                    modalChildren={<TaskForm closeModal={closeMeduimModal} category="meduim" setAlert={setAlert} />}
                    children={
                        <div>
                            {loading ? <div>
                                <Skeleton height={70} /><br />
                                <Skeleton height={70} /><br />
                                <Skeleton height={70} />
                            </div> : 
                                <>
                                {dataMeduim && dataMeduim.map((data) => (
                                    <div className="mb-2">
                                        <TaskContainer child={data.title} color={colors.secondaryColor} />
                                    </div>
                                ))}
                                </>}
                        </div>
                        }
                    
                    />
                </div>

                <div className="col">
                    <CustomContainer 
                    loading={loading}
                    isModal={lowModal}
                    title={loading ? <Skeleton height={25} /> : "Low"}
                    color={loading ? colors.greyColor : colors.grey2Color}
                    closeModal={closeLowModal}
                    onClick={openLowModal}
                    modalTitle="Low task"
                    modalChildren={<TaskForm closeModal={closeLowModal} category="low" setAlert={setAlert} />}
                    children={
                        <div>
                        {loading ? <div>
                            <Skeleton height={70} /><br />
                            <Skeleton height={70} /><br />
                            <Skeleton height={70} />
                        </div> : 
                        <>
                        {dataLow && dataLow.map((data) => (
                            <div className="mb-2">
                                <TaskContainer child={data.title} />
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