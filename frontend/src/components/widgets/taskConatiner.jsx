import { useState } from "react";
import { colors } from "../tools/color";

const TaskContainer = ({color, child}) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return ( 
        <div className="task-container" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{borderColor: color ?? colors.grey2Color, padding: "10px", position: "relative", borderRadius: "5px" }}>                
            <h6> {child}</h6>
            <p>Task 2</p>
            {isHovered && (
                <button
                    className="menu-btn"
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: colors.grey2Color,
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                    }}
                    // onClick={onDelete}
                >
                     &#8942;
                </button>
            )}

            <div className={`menu-dropdown ${isMenuOpen ? "active" : ""}`}>
                <ul>
                    <li onClick={() => { onEdit(); setIsMenuOpen(false); }}>Edit</li>
                    <li onClick={() => { onDelete(); setIsMenuOpen(false); }}>Delete</li>
                </ul>
            </div>
        </div>
     );
}
 
export default TaskContainer;