import { TextIconFeild } from "../widgets/textFeilds";
import user from "../../assets/icons/user.png";
import dropdown from "../../assets/icons/expand_arrow.png"
import dropup from  "../../assets/icons/collapse_arrow.png"
import { PrimaryButton, SecondaryButton } from "../widgets/button";

const Header = () => {

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
                <div style={rightSectionStyle}>
                    <SecondaryButton>Team</SecondaryButton>
                    <PrimaryButton>Project</PrimaryButton>
                    <div style={avatarStyle}>A</div>
                </div>
            </div>
        </section>
     );
}
 
export default Header;