import Header from "./components/modules/header"
import Home from "./components/views/home"


function App() {

  return (
    <div className="app container-fluid py-4">
      <div className="row">
        <div className="col col-2">Row 1</div>
        <div className="col container-fluid">
            <div className="header">
                <Header />
            </div>
            <div className="content">
                <Home />
            </div>
        </div>
      </div>
    </div>
  )
}

export default App
