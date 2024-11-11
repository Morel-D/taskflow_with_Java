import { colors } from "../tools/color";

const TaskContainer = ({color}) => {
    return ( 
        <div className="task-conatiner" style={{borderColor: color ?? colors.grey2Color}}>                
            <h6>This is the use of the task</h6>
            <p>Task 2</p>
        </div>
     );
}
 
export default TaskContainer;