import React from "react";

export default function UserProfile() {
  const user = {
    name: "Riya Suryawanshi",
    email: "riya@example.com",
    phone: "+91 9876543210",
    joined: "March 2024",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <img
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500"
          src={user.avatar}
          alt="User Avatar"
        />
        <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">{user.phone}</p>
        <p className="text-sm text-gray-400 mt-2">Joined {user.joined}</p>
      </div>
    </div>
  );
}
