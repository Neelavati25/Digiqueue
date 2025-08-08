import React from "react";

export default function Analytics() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">📊 Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-medium">Total Bookings</h2>
          <p className="text-2xl font-bold mt-2">1,284</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-medium">New Users</h2>
          <p className="text-2xl font-bold mt-2">347</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-medium">Cancelled Slots</h2>
          <p className="text-2xl font-bold mt-2">82</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Traffic Overview</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-400">[ Insert Chart Component Here ]</p>
        </div>
      </div>
    </div>
  );
}
