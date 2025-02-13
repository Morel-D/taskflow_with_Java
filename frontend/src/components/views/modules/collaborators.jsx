import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../../context/sessionContext";
import { PrimaryButton } from "../../widgets/button";
import search from "../../../assets/icons/search.png";
import { TextIconFeild } from "../../widgets/textFeilds";
import { PrimaryBadge } from "../../widgets/badges";
import trash from "../../../assets/icons/trash.png";
import survey from "../../../assets/icons/survey.png";
import { useSessionService } from "../../service/sessionService";
import Skeleton from "react-loading-skeleton";
import { DateCell, TextTruncate } from "../../widgets/formatDate";

const Collaborators = () => {

    const {session} = useContext(SessionContext);
    const {getCollaborators, loading} = useSessionService();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);
    let num = 1;

    useEffect(() => {
        console.log("The collaborations are ", session);
        // console.log("The collaborations ID ", session.user.userId);
        const getAllCollaborators = async () => {
            
            const response = await getCollaborators(session.user.userId);

            console.log("FINAL RESPONE --> ", response);
            setData(response.data);
        }

        getAllCollaborators();
    }, [session])

    return ( 
        <>
        <div>
            <h2>{loading ? <Skeleton height={30} width={200} /> : "Collaborators"}</h2>
            <div className="d-flex mt-4">
                <div className="col">
                    <label className=" text-secondary fs-5 fw-bold">{loading ? <Skeleton height={30} width={170} /> : (<>Members - { data.length}</>)}</label>
                </div>
                <div className="col col-4 text-end">
                {loading ? <Skeleton height={45} width={200} /> : <PrimaryButton children="New Collaborator" />} 
                </div>
            </div>
            {
                loading ? 
                (
                    <>
                    <div className="mt-1">
                        <Skeleton height={60} />
                    </div>
                    <div className="mt-2">
                        <Skeleton height={60} />
                    </div>
                    <div className="mt-2">
                        <Skeleton height={60} />
                    </div>
                    <div className="mt-2">
                        <Skeleton height={60} />
                    </div>
                    <div className="mt-2">
                        <Skeleton height={60} />
                    </div>
                    </>
                ): (
                    <div className="custom-card p-4 mt-3">
                <div className="table-responsive scrollable-tbody">
                    <table className="table table-hover custom-table">
                        <thead>
                            <tr className="custom-row-head">
                                <th scope="col" >#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Invited Date</th>
                                <th scope="col">Tasks Assigned</th>
                                <th scope="col">Status</th>
                                {/* <th scope="col">Action</th> */}
                                <th scope="col">Operation</th>

                            </tr>
                        </thead>
                        <tbody>
                           {data.map((coll) => (
                                <tr className="custom-row">
                                    <th>{num ++}</th>
                                    <td>{coll.username}</td>
                                    <td>{coll.email}</td>
                                    <td><DateCell children={coll.invited} /> </td>
                                    <td>12</td>
                                    <td> <PrimaryBadge children={coll.status}clasname="decline-badge" /> </td>
                                    {/* <td><PrimaryBadge children="Suspended" clasname="non-active-badge" /></td> */}
                                    <td>
                                        <div className="d-flex">
                                            <a href="#" className="mx-3" style={{width: "22px"}}><img src={trash} alt="image" className="img-fluid" /></a>
                                            <a href="#" className="mx-0" style={{width: "22px"}}><img src={survey} alt="image" className="img-fluid" /></a>
                                        </div>
                                    </td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
                )
            }
        </div>
        </>
     );
}
 
export default Collaborators;