import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillGearFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> CODE TEZ
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <BsGrid1X2Fill className="icon" /> Dashboard
        </li>

        <li className="sidebar-list-item" onClick={handleLogout}>
          <BsFillGearFill className="icon" /> Logout
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
