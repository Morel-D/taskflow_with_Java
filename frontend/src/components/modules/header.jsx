import { TextIconFeild } from "../widgets/textFeilds";
import user from "../../assets/icons/user.png";
import dropdown from "../../assets/icons/expand_arrow.png"
import dropup from  "../../assets/icons/collapse_arrow.png"
import { PrimaryButton, SecondaryButton } from "../widgets/button";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import Modal from "../widgets/modal";
import UserInfo from "./userInfo";
import search from "../../assets/icons/search.png";
import { authApiService } from "../service/authService";

const Header = () => {



  const {user} = useContext(AuthContext);
  const [editModal, setEditModal] = useState(false);

  const openModal = () => setEditModal(true);
  const closeModal = () => setEditModal(false);

    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 20px",
        backgroundColor: "#f8f9fa",    // Light background
      };

      
      const rightSectionStyle = {
        display: "flex",
        alignItems: "center",
        gap: "20px" // Space between buttons and avatar
      };
      
      const avatarStyle = {
        width: "50px",
        height: "50px",
        backgroundColor: "white",
        color: "black",
        fontWeight: "bold",
        fontSize: "20px",
        border: "1px solid black",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer"
      };
      
    return ( 
        <section className="">
            <div className="header-container bg-white" style={headerStyle}>
                   <div className="col-4"> <TextIconFeild icon={search} placeholder="Search..." /></div>
                <div style={rightSectionStyle}>
                    {/* <TextIconFeild  icon={search} placeholder="Search..."/> */}
                    <div onClick={openModal} style={avatarStyle}>{user.username.charAt(0) ?? "A"}</div>
                </div>
            </div>
            <Modal isOpen={editModal} onClose={closeModal} title="User details" children={<UserInfo />} />
        </section>
     );
}
 
export default Header;