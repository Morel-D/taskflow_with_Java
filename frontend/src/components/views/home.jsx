import CustomContainer from "../widgets/customConatiner";
import TaskContainer from "../widgets/taskConatiner";

const Home = () => {
    return ( 
        <div className="home">
            <div className="row">
                <div className="col">
                    <CustomContainer children={
                        <div>
                            <TaskContainer />
                        </div>
                        } />
                </div>
                <div className="col">
                    <CustomContainer />
                </div>
                <div className="col">
                    <CustomContainer />
                </div>
            </div>
        </div>
     );
}
 
export default Home;