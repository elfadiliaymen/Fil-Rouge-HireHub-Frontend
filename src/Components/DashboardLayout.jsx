import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={"dashboard-layout" + (sidebarOpen ? "" : " sidebar-closed")}>
      <Sidebar open={sidebarOpen} />
      <main className="dashboard-content">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;