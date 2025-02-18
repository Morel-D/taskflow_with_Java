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
import { DateCell, TextTruncate } from "../../widgets/formatText";
import { capitalizeFirstLetter, statusDisplay } from "../../utils/helper";
import { colors } from "../../tools/color";
import Modal from "../../widgets/modal";
import CollaboratorForm from "../forms/collaboratorForm";
import { ErrorMessage, SuccessMessage } from "../../widgets/message";

const Collaborators = () => {

    const {session} = useContext(SessionContext);
    const {getCollaborators, loading} = useSessionService();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(true);
    let num = 0;

    const [formModal, setFormModal] = useState(false);
    const opeenFormModal = () => setFormModal(true);
    const closeFormModal = () => setFormModal(false);

    const [alert, setAlert] = useState({showMessage: false, messageType: "", message: ""});
    const handleCloseMessage = () => {
        setAlert({showMessage: false, messageType: "", message: ""});
    }

    useEffect(() => {
        setLoad(true);

        console.log("The collaborations are ", session);
        // console.log("The collaborations ID ", session.user.userId);
        const getAllCollaborators = async () => {
            try{
            setLoad(true);
            const response = await getCollaborators(session.user.userId);
            console.log("FINAL RESPONE --> ", response);
            console.log("The message new ---> ", alert);
            setData(response.data);
            }catch(error){
            setLoad(false);
            }finally{
            setLoad(false);
            }
        }

        getAllCollaborators();
    }, [session])


    useEffect(() => {
        console.log('The general laoding is : ', alert.showMessage);
        console.log('The general type is : ', alert.messageType);
        console.log("The alert is : ", alert)
    }, [alert])
    

    return ( 
        <>
        <div>
            <h3 className="fw-bold" style={{color: colors.secondaryColor}}>{load ? <Skeleton height={30} width={200} /> : "Collaborators"}</h3>
            <div className="d-flex mt-4">
                <div className="col">
                    <label className=" text-secondary fs-5 fw-bold">{load ? <Skeleton height={30} width={170} /> : (<>Members - { data.length}</>)}</label>
                </div>
                <div className="col col-4 text-end">
                {load ? <Skeleton height={45} width={200} /> : <PrimaryButton children="New Collaborator" onClick={opeenFormModal} />} 
                </div>
            </div>
            {
                load ? 
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
                                <tr className={session.user.userId == coll.uid ? "custom-row d-none" : "custom-row"}>
                                    <th>{num ++}</th>
                                    <td>{coll.username}</td>
                                    <td>{coll.email}</td>
                                    <td><DateCell children={coll.invited} /> </td>
                                    <td>12</td>
                                    <td> <PrimaryBadge children={coll.status == "true" ? "Active" : capitalizeFirstLetter(coll.status)}clasname={statusDisplay(coll.status)} /> </td>
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
        <Modal isOpen={formModal} onClose={closeFormModal} children={<CollaboratorForm setAlert={setAlert} closeModal={closeFormModal} />} title="Add a member" col="col-5" />
        {alert.showMessage && alert.messageType == "fail" ? <ErrorMessage onClick={handleCloseMessage} message={alert.message} /> : null }
        {alert.showMessage && alert.messageType == "success" ? <SuccessMessage onClick={handleCloseMessage} message={alert.message} /> : null}

        
        </>
     );
}
 
export default Collaborators;