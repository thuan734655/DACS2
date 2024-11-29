import React, { useState } from "react";
import useFormData from "../../hooks/useFormData";
import handleDataDate from "../../utils/loadDateSignUp";
import checkValidData from "../../utils/validDataForm";
import VerifyOTP from "./VerifyOTP";
import { HandleVerifyOtp } from "../../controller/VerifyOTPController";
import { Link, useNavigate } from "react-router-dom";
import SuccessMessage from "./SuccessMessage.js";

const InputField = ({ type, name, placeholder, value, onChange, onBlur }) => (
  <input
    className="border border-gray-300 rounded-lg p-2 w-full mb-4"
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  />
);

const SelectField = ({ name, value, onChange, options }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="border border-gray-300 rounded-lg p-2 w-full mb-4"
  >
    {options}
  </select>
);

const SignUp = () => {
  const { formData, handleChange, handleSubmitSignUp } = useFormData({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    day: "1",
    month: "1",
    year: "1980",
    gender: "Male",
    otp: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const { loadDateOfBirth, loadMonth, loadyear } = handleDataDate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-center">Sign Up</h3>
          <p className="text-gray-600 text-center">It's quick and easy.</p>
          <div className="mt-4">
            <div className="flex space-x-2 mb-4">
              <InputField
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
                onBlur={(event) => checkValidData(event)}
              />
              <InputField
                type="text"
                name="firstname"
                placeholder="First Name"
                value={formData.firstname}
                onChange={handleChange}
                onBlur={(event) => checkValidData(event)}
              />
            </div>

            <InputField
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={(event) => checkValidData(event)}
            />

            <div className="relative mb-4">
              <InputField
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={(event) => checkValidData(event)}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </span>
            </div>

            <label className="block text-gray-700">Date of birth:</label>
            <div className="flex space-x-2 mb-4">
              <SelectField
                name="day"
                value={formData.day}
                onChange={handleChange}
                options={loadDateOfBirth()}
              />
              <SelectField
                name="month"
                value={formData.month}
                onChange={handleChange}
                options={loadMonth()}
              />
              <SelectField
                name="year"
                value={formData.year}
                onChange={handleChange}
                options={loadyear()}
              />
            </div>

            <label className="block text-gray-700">Gender:</label>
            <SelectField
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                <option key="male" value="male">
                  Male
                </option>,
                <option key="female" value="female">
                  Female
                </option>,
              ]}
            />

            <button
              onClick={() => handleSubmitSignUp(formData, setStep, setLoading)}
              className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
              type="button"
            >
              Submit
            </button>
          </div>

          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-500 hover:underline">
              Go to login
            </Link>
          </div>
        </div>
      )}
      {step === 2 && (
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
      {step === 3 && (
        <SuccessMessage
          title="Verify email successful!"
          desc="Your email has been successfully verified. You can now log in to your account."
          textNav="Go to login"
          nextPage="/login"
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default SignUp;
