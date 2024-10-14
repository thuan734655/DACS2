import React from "react";

const RequestOTP = ({ email, handleInputChange, handleRequestOtp, loading }) => (
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
);

export default RequestOTP;
