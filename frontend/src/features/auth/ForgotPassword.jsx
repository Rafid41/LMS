import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "./InputField";
import * as authService from "../../services/authService";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      // Navigate to OTP verification with email in state
      navigate("/verify-reset-otp", { state: { email } });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Failed to send reset code.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0f0d] via-[#0d1b14] to-[#08130c] rounded-2xl shadow-[0_0_30px_rgba(72,187,120,0.5)] p-8 border border-green-400/20">
        
        <Link to="/login" className="flex items-center text-green-400 hover:text-green-300 transition mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Login
        </Link>

        <h1 className="text-3xl font-bold text-center text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(72,187,120,0.8)]">
          Forgot Password?
        </h1>
        <p className="text-center text-green-200 mb-6">
          Enter your email to receive a password reset code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dark
            placeholder="example@email.com"
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
            className="w-full py-2 mt-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(72,187,120,0.7)] hover:shadow-[0_0_30px_rgba(72,187,120,0.9)] transition-all duration-300 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
