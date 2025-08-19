import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Input from "../../components/Inputs/Input";
import { UserContext } from "../../context/UserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    try {
      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch {
          setError("Image upload failed. Please try again.");
          return;
        }
      }

      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        password,
        profileImageUrl
      };
      if (adminInviteToken.trim()) {
        payload.adminInviteToken = adminInviteToken.trim();
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (err) {
      if (err.response && (err.response.data.message || err.response.data.error)) {
        setError(err.response.data.message || err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        
        {/* Space between top heading (Task Manager) and Sign Up text */}
        <div className="mt-6 mb-6 text-center">
          <h3 className="text-3xl font-bold text-black">Create Your Account</h3>
          <p className="text-base text-slate-700 mt-2">
            Please enter your details to sign up
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="space-y-6 w-full"
        >
          {/* Image Selector at top */}
          <div className="flex justify-center mb-4">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          <Input
            value={fullName}
            onChange={({ target }) => {
              setFullName(target.value);
              setError(null);
            }}
            label="Full Name"
            placeholder="John Doe"
            type="text"
            className="w-full py-3 text-lg"
          />

          <Input
            value={email}
            onChange={({ target }) => {
              setEmail(target.value);
              setError(null);
            }}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            className="w-full py-3 text-lg"
          />

          <Input
            value={password}
            onChange={({ target }) => {
              setPassword(target.value);
              setError(null);
            }}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            className="w-full py-3 text-lg"
          />

          <Input
            value={adminInviteToken}
            onChange={({ target }) => {
              setAdminInviteToken(target.value);
              setError(null);
            }}
            label="Admin Invite Token (optional)"
            placeholder="Enter token if you have one"
            type="text"
            className="w-full py-3 text-lg"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="btn-primary w-full py-3 text-lg font-semibold"
          >
            SIGN UP
          </button>

          <p className="text-[15px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link
              className="font-semibold text-s text-primary underline"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
