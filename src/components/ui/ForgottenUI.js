import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ForgottenUI = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP
  const [loading, setLoading] = useState(false); // Loading state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    else if (name === "otp") setOtp(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  // Handle request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7749/forgotten", {
        email,
      });
      alert(response.data.message); // Show OTP request success message
      setStep(2); // Move to OTP verification step
    } catch (error) {
      console.error("OTP request error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Request failed."); // Show error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7749/verify-otp", {
        email,
        otp,
      });
      alert(response.data.message); // Show OTP verification result
      setStep(3); // Move to password change step
    } catch (error) {
      console.error("OTP verification error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Verification failed."); // Show error message
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:7749/change-password",
        {
          email,
          otp,
          newPassword,
        }
      );
      alert(response.data.message);
      // Reset the form and step after successful password change
      setStep(4);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      navigate('/login')
    } catch (error) {
      console.error("Change password error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex items-center justify-center h-screen rgb(245, 242, 244)">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {step === 1 && (
          <div className="mb-6">
            <form onSubmit={handleRequestOtp}>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="otpField">
                Enter your email
              </label>
              <input
                type="email"
                name="email"
                id="otpField"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full p-2 border border-gray-300 rounded mb-4"
                disabled={loading}
              />
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={loading}
              >
                {loading ? "Requesting OTP..." : "Request OTP"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <form onSubmit={handleVerifyOtp}>
              <input type="hidden" name="email" value={email} />
              <label className="block text-gray-700 font-bold mb-2" htmlFor="otpField">
                Enter the OTP
              </label>
              <input
                type="text"
                name="otp"
                id="otpField"
                value={otp}
                onChange={handleInputChange}
                placeholder="OTP"
                required
                className="w-full p-2 border border-gray-300 rounded mb-4"
                disabled={loading}
              />
              <button
                className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <form onSubmit={handleChangePassword}>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="newPassword">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
                required
                className="w-full p-2 border border-gray-300 rounded mb-4"
                disabled={loading}
              />
              <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                required
                className="w-full p-2 border border-gray-300 rounded mb-4"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {loading ? "Changing password..." : "Change Password"}
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold mb-4">Your password has been changed successfully!</h2>
            <p>You can now log in with your new password.</p>
            <button
              className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleChangePassword()} // Reset to loginUI
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgottenUI;
