import { colors } from "../../tools/color";

const Dashboard = () => {
    return ( 
        <section className="">
            {/* Different crards  */}
            <div className="title mb-4">
                <h3 className="fw-bold" style={{color: colors.secondaryColor}}>Dashboard</h3>
            </div>
            <div className="task">
                <div className="row">
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Total Tasks</label>
                            <p className="lg-num" >14</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Assisgned Task</label>
                            <p className="lg-num" >4</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Completed Task</label>
                            <p className="lg-num" >2</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="custom-card">
                            <label className="fs-5">Overdue Tasks</label>
                            <p className="lg-num" >4</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <div className="custom-card">
                        <h5 className="fw-bold" style={{color: colors.secondaryColor}}>Assigned Tasks</h5>
                        <hr />
                    </div>
                </div>
                <div className="col"></div>
            </div>
        </section>
     );
}
 
export default Dashboard;