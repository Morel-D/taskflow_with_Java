import { useState } from "react";
import { colors } from "../tools/color";
import CustomContainer from "../widgets/customConatiner";
import TaskContainer from "../widgets/taskConatiner";
import HighFeild from "./forms/highForm";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ErrorMessage, SuccessMessage } from "../widgets/message";
import { useApiServce } from "../service/apiService";
import Loading from "../widgets/loading";
const Home = () => {

    const  {loading} = useApiServce();

    const [highModal, setHighModal] = useState(false);
    const [urgentModal, setUrgentModal] = useState(false);
    const [meduimModal, setMeduimModal] = useState(false);

    const [alert, setAlert] = useState({showMessage: false, messageType: "", message: ""});
    const [fetch, setFetch] = useState(false);

    const openHighModal = () => setHighModal(true);
    const closeHighModal = () => setHighModal(false);

    const openUrgentModal = () => setUrgentModal(true);
    const closeUrgentModal = () => setUrgentModal(false);

    const openMeduimModal = () => setMeduimModal(true);
    const closeMeduimModal = () => setMeduimModal(false);
    

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
                    modalChildren={<HighFeild closeModal={closeHighModal} />}
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
                    isModal={urgentModal}
                    title={loading ? <Skeleton height={25} /> : "Urgent"}
                    color={loading ? colors.greyColor : colors.secondaryColor}
                    closeModal={closeUrgentModal}
                    onClick={openUrgentModal}
                    modalTitle="Urgent task"
                    modalChildren="This is the uregnt title"
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
                    isModal={meduimModal}
                    title={loading ? <Skeleton height={25} /> : "Meduim"}
                    color={loading ? colors.greyColor : colors.grey2Color}
                    closeModal={closeMeduimModal}
                    onClick={openMeduimModal}
                    modalTitle="Meduim title"
                    modalChildren="This is the meduim title"
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
            {/* <SuccessMessage /> */}
            {/* <ErrorMessage /> */}
        </div>
     );
}
 
export default Home;