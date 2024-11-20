import { TextIconFeild } from "../widgets/textFeilds";
import search from "../../assets/icons/search.png";
import user from "../../assets/icons/user.png";
import dropdown from "../../assets/icons/expand_arrow.png"
import dropup from  "../../assets/icons/collapse_arrow.png"

const Header = () => {
    return ( 
        <div className="mb-4">
            <div className="row">
                <div className="col">
                    <h2>All Tasks</h2>
                    This is the header all man
                </div>
                <div className="col mt-2">
                    <div className="row">
                        <div className="col col-10">
                            <TextIconFeild icon={search} placeholder="Search for something" />
                        </div>
                        <div className="col text-end mt-1">
                            <label htmlFor="">
                                {/* <img src={dropup} className="col-1" /> */}
                                <img src={user} className="col-6" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Header;