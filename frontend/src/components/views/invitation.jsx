import team from "../../assets/icons/team.svg";
import { PrimaryButton, SecondaryButton } from "../widgets/button";
import { TextFeild } from "../widgets/textFeilds";

const Invitation = () => {
    return ( 
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="row">
                <div className="col">
                    <img src={team} alt="My Icon" width="450" height="450" />
                </div>
                <div className="col mt-5 py-5">
                    <h2>Invite a Collaborator</h2>
                    <p>Invite teammates, colleagues, or friends to join your activity and work together toward a shared goal. </p>
                    <div className="">
                        <TextFeild placeholder="Enter the user's email" />
                    </div>
                    <div className="mt-4">
                        <div className="row">
                            <div className="col">
                                <PrimaryButton children="Search" />
                            </div>
                            <div className="col text-end">
                                <SecondaryButton children="Do it later" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Invitation;