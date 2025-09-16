import React from "react";

import DashHeader from "./DashHeader";
import Dashboard from "../UI/Dashboard/dashboard";
export default function StudentDashboard({ children }) {
  return (
    <Dashboard>
      <div className="flex flex-col w-full min-h-screen ">
        <DashHeader />
        {/* <!-- Navbar end --> */}

        {children}
      </div>
    </Dashboard>
  );
}
