import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RoleSelector from "./RoleSelector";
import InputField from "./InputField";
import usersJson from "../../data/users.json";

export default function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const emailTrim = email?.trim() || "";
    const passTrim = password?.trim() || "";

    if (!emailTrim || !passTrim) {
      setError("Please provide both email and password.");
      return;
    }

    const groupKey = selectedRole.toLowerCase() === "student" ? "students" : "teachers";
    const group = usersJson[groupKey] || [];

    const user = group.find(
      (u) => (u.email || "").trim() === emailTrim && String(u.password) === passTrim
    );

    if (!user) {
      setError("Invalid email or password for selected role.");
      return;
    }

    const session = { role: selectedRole.toLowerCase(), email: user.email, name: user.name };
    localStorage.setItem("lms_session", JSON.stringify(session));
    navigate("/courses");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0f0d] via-[#0d1b14] to-[#08130c] rounded-2xl shadow-[0_0_30px_rgba(72,187,120,0.5)] p-8 transform transition-all duration-500 hover:scale-[1.01] border border-green-400/20">
        <img
          src="/assets/logo/main_logo.png"
          alt="LMS Logo"
          className="mx-auto h-20 w-auto mb-6 drop-shadow-[0_0_10px_rgba(72,187,120,0.8)]"
        />
        <h1 className="text-3xl font-bold text-center text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(72,187,120,0.8)]">
          Welcome Back!
        </h1>
        <p className="text-center text-green-200 mb-6">
          Please log in to continue
        </p>

        <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dark
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dark
          />

          {error && <div className="text-red-400 text-sm mb-1">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(72,187,120,0.7)] hover:shadow-[0_0_30px_rgba(72,187,120,0.9)] transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-green-300 mt-4 hover:text-green-400 cursor-pointer transition">
          Forgot password?
        </p>

        <p className="text-center text-sm text-green-300 mt-2">
          Don't have an account?{' '}
          <span 
            onClick={() => navigate('/register')} 
            className="font-bold text-green-400 hover:text-green-300 hover:underline cursor-pointer transition-colors"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
