import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import AuthRoutes from "./services/AuthRoute";
import LoginCheckRoute from "./services/LoginCheck";

function App() {
  const user = localStorage.getItem("token");
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      <div className={user ? "grid-container" : null}>
        {user && (
          <>
            <Header OpenSidebar={OpenSidebar} />
            <Sidebar
              openSidebarToggle={openSidebarToggle}
              OpenSidebar={OpenSidebar}
            />
          </>
        )}
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Main />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
