import { useContext, useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../widgets/button";
import { SessionContext } from "../context/sessionContext";
import { authApiService } from "../service/authService";
import { TextFeild } from "../widgets/textFeilds";

const UserInfo = () => {

    const {session} = useContext(SessionContext);
    const {getUser} = authApiService();

    const [data, setData] = useState({});

    const [editData, setEditData] = useState({name: "", email: ""});
    const [editMode, setEditMode] = useState(false);

    const switchToEdit = () => setEditMode(true);
    const cancelToEdit = () => setEditMode(false);

    useEffect(() => {
        const getUserInfo = async () => {
            const response = await getUser(`/auth/get/user/${session.user.userId}`);
            console.log("The user info is ---> ", response);
            setData(response.data);
        }

        getUserInfo();
    }, [])


    useEffect(() => {
        if (data.username && data.email) {
            setEditData({ name: data.username, email: data.email });
        }
    }, [data]); 

    const headerStyle = {
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        padding: "20px 20px",
        backgroundColor: "#f8f9fa",    // Light background
      };

      
      const rightSectionStyle = {
        display: "flex",
        alignItems: "center",
        gap: "15px" // Space between buttons and avatar
      };
      
      const avatarStyle = {
        width: "130px",
        height: "130px",
        backgroundColor: "white",
        color: "black",
        fontWeight: "bold",
        fontSize: "52px",
        border: "2px solid black",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
      };

    return ( 
        <div className="py-4">
            <div className="row">
                <div className="col col-7">
                    <div className="group ">
                        <label className="text-dark text-bold">UserName</label>
                        {editMode == false ? <p className="fs-5 mt-2 text-secondary">{data.username}</p> : <TextFeild value={editData.name} />}
                    </div>
                    <div className="group py-3">
                        <label className="text-dark text-bold">Email</label>
                        {editMode == false ? <p className="fs-5 mt-2 text-secondary">{data.email}</p> : <TextFeild value={editData.email} />}

                    </div>
                    <div className="group">
                        <label className="text-dark text-bold">Role</label>
                        <p className="fs-5 mt-2 text-secondary">{session.role}</p>
                    </div>
                </div>
                <div className="col d-flex justify-content-start mt-4">
                    <div style={avatarStyle}>{data.username && data.username.charAt(0)}</div>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3 gap-4">
                {editMode == false ? <SecondaryButton children="Logout" /> : <SecondaryButton children="Cancel" onClick={cancelToEdit} /> }
                {editMode == false ? <PrimaryButton children="Edit" onClick={switchToEdit} /> : <PrimaryButton children="Update" />}
            </div>
        </div>
     );
}
 
export default UserInfo;