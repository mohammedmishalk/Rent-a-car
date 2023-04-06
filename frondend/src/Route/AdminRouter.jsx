import { useState } from "react";
import { Routes, Route,Navigate } from "react-router-dom";
import Topbar from "../pages/Admin/global/Topbar";
import Sidebar from "../pages/Admin/global/Sidebar";
import Dashboard from "../pages/Admin/dashboard/index";
import ManageUser from '../pages/Admin/ManageUser/index';
// import Course from "../pages/Admin/Course/index";
import CarData from "../pages/Admin/CarsData/index";
import Oders from '../pages/Admin/Oders/index'
import Addcar from "../pages/Admin/AddCar/index"

// import Form from "../pages/Admin/form/index";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../pages/Admin/theme";

function AdminRouter() {
  const token= "435445"
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
            <Route path="/home" element={ token ? <Dashboard /> :<Navigate to="/admin/login"/>}/>
            
              <Route path="/manageuser" element={ token ? <ManageUser /> : <Navigate to="/admin/login"/> } />
              <Route path="/cardata" element={<CarData />}  />
              <Route path="/oders" element={ token ?  <Oders /> : <Navigate to="/admin/login"/>} />
              <Route path="/addcars" element={ token ?  <Addcar /> : <Navigate to="/admin/login"/>} />
              {/* <Route path="/form" element={ token ?  <Form / >  : <Navigate to="/admin/login"/>} /> */}
              
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminRouter;
