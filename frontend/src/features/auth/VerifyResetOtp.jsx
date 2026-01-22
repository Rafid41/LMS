import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "./InputField";
import * as authService from "../../services/authService";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [resendSuccess, setResendSuccess] = useState(false);


  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/forgot-password"); // Redirect if no email
    }
  }, [location, navigate]);

  // Timer for Resend Cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
        timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Timer for OTP Expiration
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await authService.verifyResetOtp({ email, otp });
      // Navigate to Reset Password with email AND otp (needed for final verification)
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      if (err.response) {
         setError(err.response.data.error || "Invalid OTP.");
      } else {
         setError("Network error.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError("");
    try {
        await authService.resendResetOtp({ email });
        setResendCooldown(60); // 1 minute
        setTimeLeft(600); // Reset expiration timer
        setTimeLeft(600); // Reset expiration timer
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
        setError(err.response?.data?.error || "Failed to resend OTP.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0f0d] via-[#0d1b14] to-[#08130c] rounded-2xl shadow-[0_0_30px_rgba(72,187,120,0.5)] p-8 border border-green-400/20">
        
        <h1 className="text-3xl font-bold text-center text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(72,187,120,0.8)]">
          Verify Code
        </h1>
        <p className="text-center text-green-200 mb-6">
          We sent a code to <span className="font-bold text-green-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="text-center mb-4">
                <span className="text-green-400 font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                <span className="text-green-200/60 text-xs block">time remaining</span>
           </div>

          <div className="space-y-1">
             <label className="text-sm font-semibold text-green-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] mb-1 block">
                Verification Code (OTP)
             </label>
             <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 bg-black/40 border-green-500/30 text-green-100 placeholder-green-200/50 focus:ring-green-400 shadow-[0_0_10px_rgba(72,187,120,0.3)] text-center tracking-[0.5em] font-mono text-lg"
                placeholder="------"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
                type="submit"
                disabled={loading || timeLeft === 0}
                className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(72,187,120,0.7)] hover:shadow-[0_0_30px_rgba(72,187,120,0.9)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
            </button>
             <button 
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-green-400 font-bold rounded-lg border border-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
                {resendCooldown > 0 ? `Wait ${resendCooldown}s` : "Resend OTP"}

            </button>
          </div>
          
           {resendSuccess && (
            <div className="flex justify-center items-center gap-2 mt-4 text-green-400 text-sm animate-pulse">
                <CheckCircle2 size={16} />
                <span>Code resent successfully!</span>
            </div>
           )}
        </form>
      </div>
    </div>
  );

}
