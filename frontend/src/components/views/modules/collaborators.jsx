import { useContext, useEffect } from "react";
import { SessionContext } from "../../context/sessionContext";

const Collaborators = () => {

    const {session} = useContext(SessionContext);

    useEffect(() => {
        console.log("The collaborations are ", session);
    }, [session])

    return ( 
        <div>
            This is the collaborators
        </div>
     );
}
 
export default Collaborators;