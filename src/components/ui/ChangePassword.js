import React from "react";

const ChangePassword = ({
  newPassword,
  confirmPassword,
  handleInputChange,
  handleChangePassword,
  loading
}) => (
  <form onSubmit={handleChangePassword}>
    <label className="block text-gray-700 font-bold mb-2" htmlFor="newPassword">
      New Password
    </label>
    <input
      type="password"
      name="newPassword"
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
);

export default ChangePassword;
