import React, { useState } from "react";
import useFormData from "../../hooks/useFormData";
import handleDataDate from "../../utils/loadDateSignUp";
import checkValidData from "../../utils/validDataForm";
import VerifyOTP from "./VerifyOTP";
import { HandleVerifyOtp } from "../../controller/VerifyOTPController";
import { Link, useNavigate } from "react-router-dom";
import SuccessMessage from "./SuccessMessage.js";

const SignUp = ({ setFormVisible }) => {
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
    <div>
      {step === 1 && (
        <div className="signUp">
          <div className="signUp__container">
            <div className="signUp__container--head">
              <div className="head-container">
                <h3 className="head-container--title">Sign Up</h3>
                <p className="head-container--desc">It's quick and easy.</p>
              </div>
            </div>
            {/* end signUp__container--head */}
            <div className="signUp__container--body">
              <div className="body-container">
                <div className="body-container--box-fullName">
                  <input
                    className="box-fullName--surname"
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                    onBlur={(event) => checkValidData(event)}
                  />
                  <input
                    className="box-fullName--lastname"
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                    onBlur={(event) => checkValidData(event)}
                  />
                </div>
                {/* end body-container--box-fullName */}
                <input
                  className="body-container--input-username"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={(event) => checkValidData(event)}
                />
                <div className="body-container--box-password">
                  <input
                    className="body-container--input-password"
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

                <div className="body-container--box-birth">
                  <form>
                    <label htmlFor="dob-day">Date of birth:</label>
                    <select
                      id="dob-day"
                      name="day"
                      value={formData.day}
                      onChange={handleChange}
                    >
                      {loadDateOfBirth()}
                    </select>

                    <label htmlFor="dob-month">Month:</label>
                    <select
                      id="dob-month"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                    >
                      {loadMonth()}
                    </select>

                    <label htmlFor="dob-year">Year</label>
                    <select
                      id="dob-year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                    >
                      {loadyear()}
                    </select>
                  </form>

                  <div className="body-container--Gender">
                    <label htmlFor="gender">Gender:</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleSubmitSignUp(formData, setStep)}
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
                {/* end body-container--box-birth */}
              </div>
            </div>
            {/* end signUp__container--body */}
            <div className="signUp__container--footer">
              <Link to="/login">
                <p>Go to login</p>
              </Link>
            </div>

            {/* end signUp__container--footer */}
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
