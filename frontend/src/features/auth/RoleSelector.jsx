import React from "react";

export default function RoleSelector({ selectedRole, setSelectedRole }) {
  const roles = ["Teacher", "Student"];

  return (
    <div className="flex justify-center space-x-4 mb-6">
      {roles.map((role) => (
        <button
          key={role}
          onClick={() => setSelectedRole(role)}
          className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 
            ${selectedRole === role
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
