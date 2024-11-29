import React from "react";

const VerifyOTP = ({ otp, handleInputChange, handleVerifyOtp, loading }) => (
  <form onSubmit={handleVerifyOtp}>
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
);

export default VerifyOTP;
