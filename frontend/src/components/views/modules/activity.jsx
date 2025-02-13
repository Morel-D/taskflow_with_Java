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
                const response = await getActivityById(user.uid);
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
                        {load ?  <Skeleton height={45} width={110} /> : <h3 className="fw-bold" style={{color: colors.secondaryColor}}>Activity</h3> }
                    </div>


                    {
                        load ?
                        <Skeleton height={230} /> :

                        <div className="custom-card">
                        <div className="row mx-3 p-4">
                            <div className="col col-7">
                                <div className="d-flex">
                                    <div className="col col-4">
                                        <div style={{width: "170px", height: "170px", borderStyle: "none"}}>
                                            <img src={city} alt="image" className="img-fluid w-100" />
                                        </div>
                                    </div>
                                    <div className="col my-3">
                                        <label className="fs-2 mb-4" style={{color: colors.secondaryColor}}>{activities.activity.activity}</label>
                                        <p className="text-secondary fw-normal">Owner - <span>{activities.activity.manager} {activities.role === "manager" ? "(You)" : ""}</span></p>
                                        <p  className="text-secondary">Creation date : 5 Feb at 15/02/2024</p>
                                        <div className="col mt-5">
                                            <PrimaryButton children="Edit" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col" style={{borderStyle: "solid", borderWidth: "0px 0px 0px 1px"}}>
                                <div className="">
                                <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Description</h5>
                                <p style={{lineHeight: "1.3rem"}}>{activities.activity.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    }


                    {
                        load ?
                        <div className="mt-3">
                            <Skeleton height={230} width={580} />
                        </div>:
                        <div className="row mt-3">
                        <div className="col col-6">
                            <div className="custom-card">
                                <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Collaborators</h5>
                                <hr />
                                <div className="custom-card-scroll px-4">
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
                                                <label className="text-secondary mt-2">mtchaptche@gmail.com</label>
                                            </div>
                                        </div>
                                    </>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </>
            )}
        </>
     );
}
 
export default Activity;