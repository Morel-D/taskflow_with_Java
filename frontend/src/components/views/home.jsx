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
const Home = () => {

    const  {loading} = useApiServce();

    const [highModal, setHighModal] = useState(false);
    const [lowModal, setLowModal] = useState(false);
    const [meduimModal, setMeduimModal] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, messageType: "", message: ""});
    const [fetch, setFetch] = useState(false);

    const openHighModal = () => setHighModal(true);
    const closeHighModal = () => setHighModal(false);

    const openLowModal = () => setLowModal(true);
    const closeLowModal = () => setLowModal(false);

    const openMeduimModal = () => setMeduimModal(true);
    const closeMeduimModal = () => setMeduimModal(false);


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
                            </div> : <TaskContainer color={colors.primaryColor} />}
                            
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
                            </div> : <TaskContainer color={colors.secondaryColor} />}
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
                        </div> : <TaskContainer />}
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