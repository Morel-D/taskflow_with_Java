import { useContext, useEffect, useState } from "react";
import create from "../../assets/icons/create.svg";
import usersImg from "../../assets/icons/management.png";
import { useApiServce } from "../service/apiService";
import { PrimaryButton, SecondaryButton } from "../widgets/button";
import { authActivityService } from "../service/authActivityService";
import { ButtonLoading, Loading } from "../widgets/loading";
import { AuthContext } from "../context/authContext";
import Modal from "../widgets/modal";
import { useNavigate } from "react-router-dom";
import FloatingCard from "../widgets/floatingCard";

const Organisation = () => {

    const navigate = useNavigate();

    const activityUid = localStorage.getItem("activityUid");
    const [getdata, setGetData] = useState([]);
    const [collaborators, setCollaborator] = useState([]);
    const {user} = useContext(AuthContext);

    var data = {
        "uid": activityUid
    }
    const {accessActivity, loading, collaboratorActivity} = authActivityService();



    useEffect(() => {
        const getActivity = async () => {
            const response = await accessActivity("activity/get", data);
            console.log("the resposne here is --> ", response);
            setGetData(response);
        } 
        getActivity();
    }, []);


    const handleUserCollaborate  = async () => {

        var data = {
            "userId": user.uid
        }

        const response = await collaboratorActivity("activity/get/user", data);
        console.log("Response --> ", response);
        if(response.status == "true"){
            const currentPath = window.location.pathname;
            const modifiedPath = currentPath.replace("/option/organisation", "/");
            navigate(modifiedPath);
        }
    }

    return ( 
        <>
            <div>
                
                {
                    loading ? <div className="d-flex align-items-center justify-content-center vh-100"><Loading /></div>
                    :
                    <div className="py-5 text-center mt-5 mx-5">
                    <h1>Do you want to collaborate ? </h1>
                    <br />
                    <div className="d-flex justify-content-center">
                        <div className="card p-4 col-8">
                            {getdata.map((data) => (
                                <div className="row" key={data.id}>
                                <div className="col col-5">
                                    <img src={create} alt="My Icon" width="300" height="300" />
                                </div>
                                <div className="col text-start">
                                    <label className="fw-1">Activity Name -</label>
                                    <h2 className="text-dark fw-bold">{data.name}</h2>
                                    <label className="fw-1 mt-2">Created by -</label>
                                    <div>
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
                                        {data.userName.charAt(0) ?? "A"}
        
                                    </div>
                                    <div className="col text-start text-dark">
                                        <b>{data.userName}</b><br />
                                        <label className="text-secondary">{data.email}</label>
                                    </div>
                                    </div>

                                    </div>
                                    <label className="fw-1 mt-2">Description -</label><br />
                                    <label className="fw-1 text-dark">{data.description}</label><br />
                                    {data.collaborators.length == 0 ? <><br /><br /></> : (
                                        <>
                                        <label className="fw-1 mt-2">Collaborators -</label>
                                            <div className="mt-2">
                                            <FloatingCard triggerText={
                                                <div className="d-flex">
                                                    <div className="col col-1">
                                                        <img src={usersImg} alt="" style={{width: "33px"}} />
                                                    </div>
                                                    <div className="col mt-1"><p className="text-dark">{data.collaborators[0].name} {data.collaborators.length - 1 == 0 ? "" : `and ${data.collaborators.length - 1} other ${data.collaborators.length - 1 > 1 ? "collaborators" : "collaborator" }` }</p></div>
                                                </div> 
                                            }>
                                                {
                                                    data.collaborators.map((collaborator) => (
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
                                                            {collaborator.name.charAt(0) ?? "A"}
                            
                                                        </div>
                                                        <div className="col text-start text-dark">
                                                            <b>{collaborator.name}</b><br />
                                                            <label className="text-secondary">{collaborator.email}</label>
                                                        </div>
                                                        </div>
                                                    ))
                                                }
            
                                            </FloatingCard>                          
                                                <br />
                                                <br />

                                            </div>
                                        </>
                                    )}
                                    <div className="d-flex justify-content-end">
                                        <div className="">
                                                <SecondaryButton children="Decline" />
                                            </div>
                                            <div className="mx-4">
                                                {loading ? <ButtonLoading /> :<PrimaryButton children="Join in" onClick={handleUserCollaborate}/>}
                                            </div>
                                    </div>
                                </div>
                            </div>
                            ) )}
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
     );
}
 
export default Organisation;