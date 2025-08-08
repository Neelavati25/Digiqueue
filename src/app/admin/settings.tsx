import React, { useState } from "react";

export default function Settings() {
  const [email, setEmail] = useState("admin@example.com");
  const [name, setName] = useState("Admin User");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">⚙️ Admin Settings</h1>

      <form className="space-y-6 max-w-md">
        <div>
          <label className="block font-medium">Name</label>
          <input
            className="w-full border rounded p-2 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            className="w-full border rounded p-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
