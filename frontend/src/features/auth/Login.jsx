import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./InputField";
import * as authService from "../../services/authService";
import { Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      
      // Store token and session
      localStorage.setItem("token", res.data.token);
      
      const session = { 
          role: res.data.role, 
          email: res.data.email 
      };
      localStorage.setItem("lms_session", JSON.stringify(session));

      // Redirect based on role
      if (res.data.role === 'student') {
        navigate("/student");
      } else if (res.data.role === 'teacher') {
        navigate("/teacher");
      } else {
        navigate("/courses");
      }

    } catch (err) {
      console.error(err);
      if (err.response) {
          setError(err.response.data?.error || "Login failed. Please check your credentials.");
      } else if (err.request) {
          setError("Network error. Please check your connection.");
      } else {
          setError(`Error: ${err.message}`);
      }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x  p-4">
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

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(72,187,120,0.7)] hover:shadow-[0_0_30px_rgba(72,187,120,0.9)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
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
