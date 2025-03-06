import { useContext, useEffect, useState } from "react";
import { colors } from "../../tools/color";
import { PrimaryButton } from "../../widgets/button";
import { SessionContext } from "../../context/sessionContext";
import { useSessionService } from "../../service/sessionService";
import { AuthContext } from "../../context/authContext";
import city from "../../../assets/icons/city.png";
import Skeleton from "react-loading-skeleton";

const Activity = () => {

    const [activities, setActivities] = useState();
    const [load, setLoad] = useState(true);
    const {session} = useContext(SessionContext);
    const {user} = useContext(AuthContext);
    const {getActivityById} = useSessionService();

    useEffect(() => {
        setLoad(true);
        const getActivity = async () => {
            try{
                const response = await getActivityById(session.activity.userId);
                console.log("ACTIVITY --> ", response.activity);
                setActivities(response);
            }catch(error){
                console.log("ERROR NIGG --> ", error);
            }finally{
                setLoad(false);
            }
        } 
        getActivity();
    }, [session])


    return ( 
        <>
            {activities && (
                <>
                    <div className="mb-4">
                        {load ?  <Skeleton height={45} width={110} /> : 
                        <div className="row">
                            <div className="col">
                                <h3 className="fw-bold" style={{color: colors.secondaryColor}}>Activity</h3>
                            </div>
                            <div className="col text-end mt-2">
                                {session.role == "manager" ?  <PrimaryButton children="Edit" /> : null}
                            </div>
                        </div>
                        
                         }
                    </div>


                    <div className="row">
                        <div className="col">
                                {
                                load ?
                                <Skeleton height={230} /> :

                                <div className="custom-card">
                                    <div className="col col-7">
                                        <div className="">
                                            <div className="col my-3">
                                                <label className="fs-2 mb-4 fw-bold" style={{color: colors.secondaryColor}}>{activities.activity.activity}</label>
                                                <p className="text-secondary fw-normal mt-2">Owner - <span>{activities.activity.manager} {session.role === "manager" ? "(You)" : ""}</span></p>
                                                <label  className="text-secondary">Creation date : 5 Feb at 15/02/2024</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col" >
                                        <div className=" mt-5">
                                        <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Description</h5>
                                        <p style={{lineHeight: "1.3rem"}}>{activities.activity.description}</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="col">
                                {
                                load ?
                                <div className="mt-3">
                                    <Skeleton height={230} width={580} />
                                </div>:
                                   <div className="parent-container">
                                        <div className="custom-card vh-100">
                                            <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Collaborators</h5>
                                            <hr />
                                            <div className="custom-card-scroll  px-4">
                                            {activities.collaborators.map((collaborator) => (
                                                <>
                                                    <div className="row py-1 align-items-center">
                                                        <div className="col col-2 d-flex  align-items-center"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                backgroundColor: "white",
                                                                color: "black",
                                                                fontWeight: "bold",
                                                                fontSize: "18px",
                                                                borderStyle: "solid",
                                                                borderRadius: "50%",
                                                                borderWidth: "1px",
                                                                borderColor: "black",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                            >
                                                            {collaborator.username.charAt(0) ?? "A"}
                            
                                                        </div>
                                                        <div className="col text-start text-dark">
                                                            <b>{collaborator.username}</b><br />
                                                            <label className="text-secondary mt-2">{collaborator.email}</label>
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                            </div>
                                        </div>
                                   </div>
                            }
                        </div>
                    </div>


                </>
            )}
        </>
     );
}
 
export default Activity;