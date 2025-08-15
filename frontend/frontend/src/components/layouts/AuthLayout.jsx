import React from "react";
import UI_IMG from "../../assets/images/computer-security-with-login-password-padlock.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row w-screen h-screen">
      {/* Left Side - Form */}
      <div className="flex-1 px-12 pt-8 pb-12 flex flex-col">
        <h2 className="text-3xl font-bold text-black">Task Manager</h2>
        {children}
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 flex items-center justify-center bg-blue-50 p-8">
        <img
          src={UI_IMG}
          alt="UI preview"
          className="w-64 lg:w-[90%] object-contain"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
