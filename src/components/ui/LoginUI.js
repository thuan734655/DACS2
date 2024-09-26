import React, { useState } from "react";
import Title from "../../assets/imgs/Title.png";
import { Link } from "react-router-dom";
const LoginUI = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-pink-100">
      <div>
        <div className="mb-">
          <img src={Title} alt="Descriptive Logo" className="w-96 h-auto" />
        </div>
        <div className="text-center m-5">
          <p className="text-gray-700 text-2xl">
            ITN helps you connect and share with the people in your life.
          </p>
        </div>
      </div>
      <div className="bg-white p-10 rounded-lg shadow-lg w-96 space-y-6">
        <div>
          <input
            type="email"
            className="bg-gray-100 p-3 rounded-lg w-full shadow-md"
            placeholder="Email address"
          />
        </div>

        <div className="relative">
          <input
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 w-full rounded-lg shadow-md">
            Login
          </button>
        </div>
        <div>
          <Link to="/ForgottenUI" className="text-blue-500">
            Forgotten password?
          </Link>
        </div>

        <hr className="my-6 border-gray-300" />

        <div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 w-full rounded-lg shadow-md">
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
