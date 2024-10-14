import React from "react";

const SuccessMessage = ({ navigate }) => (
  <div>
    <h2 className="text-lg font-bold mb-4">
      Your password has been changed successfully!
    </h2>
    <p>You can now log in with your new password.</p>
    <button
      className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => navigate("/login")}
    >
      Back to Login
    </button>
  </div>
);

export default SuccessMessage;
