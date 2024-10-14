import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestOtp from "./RequestOTP";
import VerifyOtp from "./VerifyOTP";
import ChangePassword from "./ChangePassword";
import SuccessMessage from "./SuccessMessage";
import { HandleRequestOtp } from "../../controller/RequestOTPController";
import { HandleVerifyOtp } from "../../controller/VerifyOTPController";
import { HandleChangePassword } from "../../controller/ChangePasswordController";

const Forgotten = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    else if (name === "otp") setOtp(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-pink-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {step === 1 && (
          <RequestOtp
            email={email}
            handleInputChange={handleInputChange}
            handleRequestOtp={(e) => HandleRequestOtp(e, email, setLoading, setStep)}
            loading={loading}
          />
        )}
        {step === 2 && (
          <VerifyOtp
            otp={otp}
            handleInputChange={handleInputChange}
            handleVerifyOtp={(e) => HandleVerifyOtp(e, email, otp, setLoading, setStep)}
            loading={loading}
          />
        )}
        {step === 3 && (
          <ChangePassword
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            handleInputChange={handleInputChange}
            handleChangePassword={(e) => HandleChangePassword(e, email, otp, newPassword, confirmPassword, setLoading, setStep, navigate)}
            loading={loading}
          />
        )}
        {step === 4 && <SuccessMessage navigate={navigate} />}
      </div>
    </div>
  );
};

export default Forgotten;
