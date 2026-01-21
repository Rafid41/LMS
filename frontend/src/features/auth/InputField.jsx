import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({ label, type, value, onChange, dark = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col space-y-1">
      <label
        className={`text-sm font-semibold mb-1 transition-all duration-300 ${
          dark
            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 ${
            dark
              ? "bg-black/40 border-green-500/30 text-green-100 placeholder-green-200/50 focus:ring-green-400 shadow-[0_0_10px_rgba(72,187,120,0.3)]"
              : "border-gray-300 text-gray-800 focus:ring-blue-500"
          } ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
              dark ? "text-green-400 hover:text-green-300" : "text-gray-400 hover:text-indigo-500"
            }`}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
