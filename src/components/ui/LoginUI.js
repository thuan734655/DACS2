import React, { useState } from "react";
import Title from "../../assets/imgs/Title.png";
import { Link } from "react-router-dom";
import useFormData from "../../hooks/useFormData";
import { useNavigate } from "react-router-dom";
import handleLogin from "../../controller/HandleLogin";
import SignUp from "./SignUp";

const LoginUI = () => {

  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const handleButtonClickCreateNewAccount = () => {
    setIsVisible(true);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const { formData, handleChange } = useFormData({
    email: "",
    password: "",
  });
 
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen bg-pink-100 p-4 sm:p-8">
      <div>
        <div className=" flex flex-col items-center lg:items-start lg:mr-8 mb-8 lg:mb-0">
          <img
            src={Title}
            alt="Descriptive Logo"
            className="w-64 h-auto sm:w-96"
          />
        </div>
        <div className="text-center m-6 lg:text-left">
          <p className="text-gray-700 text-lg sm:text-2xl">
            ITN helps you connect and share with the people in your life.
          </p>
        </div>
      </div>
      <div className="bg-white p-6 sm:p-10 rounded-lg w-full max-w-md shadow-lg  space-y-6">
        <div>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            className="bg-gray-100 p-3 rounded-lg w-full shadow-md"
            placeholder="Email address"
          />
        </div>

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

        <div>
          <button
            onClick={() => handleLogin(formData, navigate)}
            
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 w-full rounded-lg shadow-md"
          >
            Login
          </button>
        </div>
        <div>
          <Link to="/forgotten" className="text-blue-500">
            Forgotten password?
          </Link>
        </div>

        <hr className="my-6 border-gray-300" />

        <div>
          
          <button
            onClick={handleButtonClickCreateNewAccount}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 w-full rounded-lg shadow-md"
          >
            Create New Account
          </button>
        </div>
        <div className="box-signUp">
          {isVisible && <SignUp setFormVisible={setIsVisible}/>}
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
