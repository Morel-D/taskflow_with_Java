import Header from "./components/modules/header"
import Navbar from "./components/modules/navbar"
import Auth from "./components/views/auth"
import Home from "./components/views/home"
import Intro from "./components/views/intro"


function App() {

  return (
    <div className="app container-fluid">
        {/* <Intro /> */}
        <Auth />
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
