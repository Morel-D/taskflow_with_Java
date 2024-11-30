import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";

export const StrictModeDroppable = ({children, ...props}) => {
    const [enable, setEnable] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnable(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnable(true);
        }
    }, [])
    if(!enable) {
        return null;
    }

    return <Droppable {...props}>{children}</Droppable>
}