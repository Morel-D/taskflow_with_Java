import { useState } from "react";
import { colors } from "../tools/color";
import CustomContainer from "../widgets/customConatiner";
import TaskContainer from "../widgets/taskConatiner";
import HighFeild from "./forms/highForm";
import { ErrorMessage, SuccessMessage } from "../widgets/message";
const Home = () => {

    const [highModal, setHighModal] = useState(false);
    const [urgentModal, setUrgentModal] = useState(false);
    const [meduimModal, setMeduimModal] = useState(false);

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
                    isModal={highModal}
                    title="High Priority"
                    color={colors.primaryColor}
                    closeModal={closeHighModal}
                    onClick={openHighModal}
                    modalTitle="Add a task"
                    modalChildren={<HighFeild closeModal={closeHighModal} />}
                    children={
                        <div>
                            <TaskContainer color={colors.primaryColor} />
                        </div>
                        } />
                </div>
                <div className="col">
                    <CustomContainer
                    isModal={urgentModal}
                    title="Urgent"
                    color={colors.dangerColor}
                    closeModal={closeUrgentModal}
                    onClick={openUrgentModal}
                    modalTitle="uregnt title"
                    modalChildren="This is the uregnt title"
                    children={
                        <div>
                            <TaskContainer color={colors.dangerColor} />
                        </div>
                        }
                    
                    />
                </div>
                <div className="col">
                    <CustomContainer 
                    isModal={meduimModal}
                    title="Meduim"
                    closeModal={closeMeduimModal}
                    onClick={openMeduimModal}
                    modalTitle="Meduim title"
                    modalChildren="This is the meduim title"
                    children={
                        <div>
                            <TaskContainer />
                        </div>}
                    />
                </div>
            </div>
            {/* <SuccessMessage /> */}
            {/* <ErrorMessage /> */}
        </div>
     );
}
 
export default Home;