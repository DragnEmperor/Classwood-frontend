import React, { useState } from "react";

import DashHeader from "./DashHeader";
import { Rings } from "react-loader-spinner";
import Dashboard from "../UI/Dashboard/dashboard";
export default function StudentDashboard({ children }) {
  const [loading, setLoading] = useState(false);
  return (
    <Dashboard>
      <div className="flex flex-col w-full min-h-screen">
        <DashHeader setLoading={setLoading} />
        {loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <Rings
              height="220"
              width="220"
              // radius="9"
              color="rgb(30 64 175)"
              ariaLabel="loading"
            />{" "}
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
    </Dashboard>
  );
}
