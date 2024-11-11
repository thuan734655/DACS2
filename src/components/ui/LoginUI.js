import React, { useState } from "react";
import Title from "../../assets/imgs/Title.png";
import { Link, useNavigate } from "react-router-dom";
import useFormData from "../../hooks/useFormData";
import HandleLoginController from "../../controller/HandleLoginController";
import { HandleVerifyOtp } from "../../controller/VerifyOTPController";
import VerifyOTP from "./VerifyOTP";
import SuccessMessage from "./SuccessMessage";
const LoginUI = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const { formData, handleChange } = useFormData({
    email: "",
    password: "",
    otp: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-200 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {step === 1 && (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-between lg:space-x-8 mb-8 w-full signUp-box">
            <div className="flex flex-col items-center lg:items-start lg:mr-8 mb-8 lg:mb-0">
              <img
                src={Title}
                alt="Descriptive Logo"
                className="w-64 h-auto sm:w-96"
              />
              <div className="text-center m-6 lg:text-left">
                <p className="text-gray-700 text-lg sm:text-2xl">
                  ITN helps you connect and share with the people in your life.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-lg w-full max-w-md shadow-lg space-y-6">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="bg-gray-100 p-3 rounded-lg w-full shadow-md focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
              />
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                onClick={() =>
                  HandleLoginController(formData, navigate, setStep)
                }
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 w-full rounded-lg shadow-md"
              >
                Login
              </button>

              <div className="text-center">
                <Link to="/forgotten" className="text-blue-500">
                  Forgotten password?
                </Link>
              </div>

              <hr className="my-6 border-gray-300" />
              <Link to="/signup" className="text-blue-500">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 w-full rounded-lg shadow-md">
                  Create New Account
                </button>
              </Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-lg shadow-lg mt-8">
            <VerifyOTP
              otp={formData.otp}
              handleInputChange={handleChange}
              handleVerifyOtp={(e) =>
                HandleVerifyOtp(
                  e,
                  formData.email,
                  formData.otp,
                  setLoading,
                  setStep
                )
              }
              loading={loading}
            />
          </div>
        )}
        {step === 3 && (
          <SuccessMessage
            title="Two-Factor Authentication Successful!"
            desc="Your identity has been verified successfully. You can now access your account."
            textNav="Go to home"
            nextPage="/homepage"
            navigate={navigate}
          />
        )}
        {step === 4 && (
          <VerifyOTP
            otp={formData.otp}
            handleInputChange={handleChange}
            handleVerifyOtp={(e) =>
              HandleVerifyOtp(
                e,
                formData.email,
                formData.otp,
                setLoading,
                setStep
              )
            }
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default LoginUI;
