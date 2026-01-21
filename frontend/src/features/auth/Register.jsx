import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import * as authService from "../../services/authService";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  // State
  const [selectedRole, setSelectedRole] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [resendCooldown, setResendCooldown] = useState(60);

  // UI State
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer Effects
  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  useEffect(() => {
    let timer;
    if (otpSent && resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!selectedRole) {
      setError("Please select an account type.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    // Password Validation
    const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strengthRegex.test(password)) {
        setError("Password: 8+ chars, Upper, Lower, Number, Special char.");
        return;
    }

    setLoading(true);

    try {
      await authService.register({
        email,
        password,
        password_confirm: passwordConfirm,
        user_type: selectedRole.toLowerCase(),
      });
      setOtpSent(true);
      setSuccessMsg(`OTP sent to ${email}`);
      setTimeLeft(600);
      setResendCooldown(60);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Registration failed";
      // Handle dict errors (e.g. {password: [...]})
      if (typeof err.response?.data === 'object' && !err.response?.data?.error) {
           setError(Object.values(err.response.data).flat().join(", "));
      } else {
           setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp });
      setSuccessMsg("Account created! Redirecting...");
      
      // Store token
      // Note: Backend VerifyOTP returns { token, user_id, role, ... }
      // But verify_user.py script showed it returns token in 'token' key?
      // Wait, VerifyOTPView implementation returns:
      if (res.data?.token) {
        // Mocking session for now to match Login.jsx expected format if possible?
        // Login.jsx sets "lms_session". 
        // But we are moving to Real API. 
        // For compatibility with partial migration, I should set both?
        // Or just what the Real API needs. 
        // Real API Authentication is usually Token based.
        localStorage.setItem("token", res.data.token);
      }
      
      // Also set lms_session for legacy compatibility if needed?
      // Login.jsx uses: localStorage.setItem("lms_session", JSON.stringify(session));
      // session = { role, email, name }
      const session = { 
          role: res.data.role, 
          email: res.data.email
      };
      localStorage.setItem("lms_session", JSON.stringify(session));

      setTimeout(() => {
        if (res.data.role === 'student') {
            navigate("/student");
        } else if (res.data.role === 'teacher') {
            navigate("/teacher");
        } else {
            navigate("/courses");
        }
      }, 1500);
    } catch (err) {
       setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError("");
    try {
      await authService.resendOtp({ email });
      setSuccessMsg("OTP resent successfully.");
      setResendCooldown(60);
      setTimeLeft(600);
    } catch (err) {
       setError(err.response?.data?.error || "Resend failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black animate-gradient-x p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-[#0a0f0d] via-[#0d1b14] to-[#08130c] rounded-2xl shadow-[0_0_30px_rgba(72,187,120,0.5)] p-8 transform transition-all duration-500 hover:scale-[1.01] border border-green-400/20">
        
        {/* Branding */}
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-400 mb-2 drop-shadow-[0_0_10px_rgba(72,187,120,0.8)]">
            {otpSent ? "Verify Email" : "Create Account"}
            </h1>
            <p className="text-green-200 text-sm">
            {otpSent ? `Enter the OTP sent to ${email}` : "Join us to start learning"}
            </p>
        </div>



        {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-900/40 border border-red-500/50 text-red-200 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
        )}

        {successMsg && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-green-900/40 border border-green-500/50 text-green-200 text-sm">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
            </div>
        )}

        {/* Forms */}
        {!otpSent ? (
            <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Account Type Dropdown */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] mb-1">
                    Account Type
                </label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300 bg-black/40 border-green-500/30 text-green-100 focus:ring-green-400 shadow-[0_0_10px_rgba(72,187,120,0.3)] appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234ade80' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                >
                    <option value="" disabled className="bg-gray-900 text-gray-500">Choose account type</option>
                    <option value="Student" className="bg-gray-900 text-green-100">Student</option>
                    <option value="Teacher" className="bg-gray-900 text-green-100">Teacher</option>
                </select>
            </div>

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
             <InputField
                label="Confirm Password"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                dark
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(72,187,120,0.7)] hover:shadow-[0_0_30px_rgba(72,187,120,0.9)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Next Step"}
            </button>
            </form>
        ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
             <div className="text-center mb-4">
                <span className="text-green-400 font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                <span className="text-green-200/60 text-xs block">time remaining</span>
             </div>

             <div className="space-y-1">
                 <label className="text-sm font-semibold text-green-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] mb-1 block">
                    One-Time Password
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

            <div className="flex gap-3">
                 <button
                    type="submit"
                    disabled={loading || timeLeft === 0}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(72,187,120,0.7)] hover:shadow-[0_0_30px_rgba(72,187,120,0.9)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Login"}
                </button>
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resendCooldown > 0}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-green-400 font-bold rounded-lg border border-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {resendCooldown > 0 ? `Wait ${resendCooldown}s` : "Resend OTP"}
                </button>
            </div>
            
            <button 
                type="button" 
                onClick={() => setOtpSent(false)} 
                className="w-full text-center text-sm text-green-300/70 hover:text-green-400 mt-2 transition"
            >
                Back to details
            </button>
            </form>
        )}

        <p className="text-center text-sm text-green-300 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-green-400 hover:text-green-300 hover:underline transition-colors">
            Sign in
            </Link>
        </p>
      </div>
    </div>
  );
}
