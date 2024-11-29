import React from "react";
import DashboardCards from "./components/DashboardCards";
import RequestList from "./components/RequestList";

const page = () => {

  return (
    <>
        <div className="container mx-auto p-5">
          <h3 className="text-3xl font-medium text-gray-700">Dashboard Juez</h3>

          <DashboardCards />
          <div className="mt-8"></div>
            <RequestList />
          </div>
    </>
  );
};

export default page;
