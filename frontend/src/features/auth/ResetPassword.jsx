import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "./InputField";
import * as authService from "../../services/authService";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email && location.state?.otp) {
      setEmail(location.state.email);
      setOtp(location.state.otp);
    } else {
      navigate("/forgot-password"); 
    }
  }, [location, navigate]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 chars long.";
    if (!/[A-Z]/.test(pwd)) return "Must contain an uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Must contain a lowercase letter.";
    if (!/[0-9]/.test(pwd)) return "Must contain a number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Must contain a special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
    }
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    
    const pwdError = validatePassword(newPassword);
    if (pwdError) {
        setError(pwdError);
        return;
    }

    setError("");
    setLoading(true);

    try {
      await authService.resetPassword({ email, otp, new_password: newPassword });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response) {
         setError(err.response.data.error || "Failed to reset password.");
      } else {
         setError("Network error.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x p-4">
            <div className="w-full max-w-md bg-gradient-to-br from-[#0a0f0d] via-[#0d1b14] to-[#08130c] rounded-2xl shadow-[0_0_30px_rgba(72,187,120,0.5)] p-8 border border-green-400/20 text-center">
                <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4 drop-shadow-[0_0_15px_rgba(72,187,120,0.8)]" />
                <h1 className="text-3xl font-bold text-green-400 mb-2">Success!</h1>
                <p className="text-green-200 mb-6">Your password has been reset successfully.</p>
                <p className="text-gray-400">Redirecting to login...</p>
            </div>
        </div>
      );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0f0d] via-[#0d1b14] to-[#08130c] rounded-2xl shadow-[0_0_30px_rgba(72,187,120,0.5)] p-8 border border-green-400/20">
        
        <h1 className="text-3xl font-bold text-center text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(72,187,120,0.8)]">
          Reset Password
        </h1>
        <p className="text-center text-green-200 mb-6">
          Create a new password for <span className="font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            dark
            placeholder="Min 8 chars, mixed case & symbols"
          />
           <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            dark
            placeholder="Confirm new password"
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
            {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
