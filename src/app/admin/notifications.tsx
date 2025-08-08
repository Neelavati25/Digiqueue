import React from "react";

const notifications = [
  {
    id: 1,
    message: "User Riya booked a slot at Sai Temple",
    time: "2 mins ago",
  },
  {
    id: 2,
    message: "Slot cancelled at ABC Hospital",
    time: "30 mins ago",
  },
  {
    id: 3,
    message: "New user signed up: Pranav",
    time: "1 hour ago",
  },
];

export default function Notifications() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">🔔 Notifications</h1>

      <div className="space-y-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition"
          >
            <p className="font-medium">{note.message}</p>
            <span className="text-sm text-gray-500">{note.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
