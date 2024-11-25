import { colors } from "../tools/color";

const TaskContainer = ({color, child}) => {
    return ( 
        <div className="task-conatiner" style={{borderColor: color ?? colors.grey2Color}}>                
            <h6> {child}</h6>
            <p>Task 2</p>
        </div>
     );
}
 
export default TaskContainer;