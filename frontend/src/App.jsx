import { useContext } from "react"
import Auth from "./components/views/auth"
import { AuthContext } from "./components/context/authContext"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthenticatedRedirect from "./components/routes/authenticatedRedirect"
import RequireAuth from "./components/routes/requireAuth"
import MainRoutes from "./components/routes/mainRoutes"
import RequireToken from "./components/routes/requireToken"
import SettingRoutes from "./components/routes/settingRoute"
import Options from "./components/views/options"


function App() {

  const {user} = useContext(AuthContext);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<AuthenticatedRedirect><Auth /></AuthenticatedRedirect>} />
            <Route path="/option/*" element={<RequireAuth><SettingRoutes /></RequireAuth>} />
            <Route path="/*" element={<RequireToken><MainRoutes /></RequireToken>} />
            
        </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
