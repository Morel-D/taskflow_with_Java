import Header from "./components/modules/header"
import Navbar from "./components/modules/navbar"
import Auth from "./components/views/auth"
import AuthActivity from "./components/views/authActivity"
import Home from "./components/views/home"
import Intro from "./components/views/intro"
import Invitation from "./components/views/invitation"
import Option from "./components/views/option"


function App() {

  return (
    <div className="app container-fluid">
        {/* <Intro /> */}
        {/* <Option /> */}
        {/* <AuthActivity /> */}
        <Invitation/>
      {/* <div className="row py-4">
        <div className="col col-2">
          <Navbar />
        </div>
        <div className="col container-fluid">
            <div className="header">
                <Header />
            </div>
            <div className="content">
                <Home />
            </div>
        </div>
      </div> */}
    </div>
  )
}

export default App
