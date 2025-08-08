import React, { useState } from "react";

export default function UserSettings() {
  const [name, setName] = useState("Riya Suryawanshi");
  const [email, setEmail] = useState("riya@example.com");
  const [phone, setPhone] = useState("+91 9876543210");

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">⚙️ Edit Profile</h1>

      <form className="space-y-5 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium">Name</label>
          <input
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            type="tel"
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
