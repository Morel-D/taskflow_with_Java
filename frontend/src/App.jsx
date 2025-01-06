import { useContext } from "react"
import Header from "./components/modules/header"
import Navbar from "./components/modules/navbar"
import Auth from "./components/views/auth"
import AuthActivity from "./components/views/authActivity"
import Home from "./components/views/home"
import Intro from "./components/views/intro"
import Invitation from "./components/views/invitation"
import Option from "./components/views/option"
import { AuthContext } from "./components/context/authContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthenticatedRedirect from "./components/routes/authenticatedRedirect"
import RequireAuth from "./components/routes/requireAuth"
import MainRoutes from "./components/routes/mainRoutes"


function App() {

  const {user} = useContext(AuthContext);

  return (
    <div className="app container-fluid">
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<AuthenticatedRedirect><Auth /></AuthenticatedRedirect>} />
            <Route path="/*" element={<RequireAuth><MainRoutes /></RequireAuth>} />
        </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
