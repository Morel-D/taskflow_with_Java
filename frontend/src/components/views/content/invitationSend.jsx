import { PrimaryButton, SecondaryButton } from "../../widgets/button";
import plane from "../../../assets/icons/plane.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const InvitationSend = ({email, onClose}) => {

    const {loading} = useContext(AuthContext);

    return ( 
    <div className="">
        <div className="text-center py-5">
            <img src={plane} alt="My Icon" width="100" height="100" />
        </div>
        <h5 className="text-dark fw-bold text-center mb-3">Invitation Sent Successfully</h5>
        <p>The invitation has been sent to your new collaborator <b className="text-secondary">{email}</b>. You can invite another collaborator now or choose to do it later.
            Keep building your team for a more efficient collaboration!</p>
        <div className="footer mt-4">
            <div className="row text-end">
                <div className="col">
                    <PrimaryButton children="New Invitation" onClick={onClose} />
                </div>
                <div className="col col-3">
                    <SecondaryButton children="Do it later" />
                </div>
            </div>
        </div>
    </div>
 );
}
 
export default InvitationSend;