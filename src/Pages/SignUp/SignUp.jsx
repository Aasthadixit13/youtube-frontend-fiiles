


import React, { useState } from 'react';
import './signUp.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import "@fontsource/poppins/800.css";

const SignUp = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    "https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain"
  );

  const [signUpField, setSignUpField] = useState({
    channelName: "",
    userName: "",
    email: "",
    password: "",
    about: "",
    profilePic: uploadedImageUrl
  });

  // NEW: State to hold inline field-specific error messages
  const [errors, setErrors] = useState({
    channelName: "",
    userName: "",
    email: "",
    password: ""
  });

  const [progressBar, setProgressBar] = useState(false);
  const navigate = useNavigate();

  const handleInputFiled = (event, name) => {
    const value = event.target.value;
    setSignUpField({
      ...signUpField,
      [name]: value
    });

    // NEW: Clear error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const uploadImage = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'youtube-clone');

    try {
      setProgressBar(true);
      const response = await api.post(
        "https://api.cloudinary.com/v1_1/dhlklhfgj/image/upload",
        data
      );
      const imageUrl = response.data.url;
      setUploadedImageUrl(imageUrl);
      setSignUpField({
        ...signUpField,
        profilePic: imageUrl
      });
      toast.success("Profile picture uploaded!");
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed");
    } finally {
      setProgressBar(false);
    }
  };

const handleSignup = async () => {
  // Reset errors
  setErrors({
    channelName: "",
    userName: "",
    email: "",
    password: ""
  });

  let newErrors = {};
  let hasError = false;

  // Channel Name validation
  if (!signUpField.channelName.trim()) {
    newErrors.channelName = "Channel Name is required";
    hasError = true;
  }

  // ✅ Username validation (ADDED)
  if (!signUpField.userName.trim()) {
    newErrors.userName = "Username required";
    hasError = true;
  }

  // ✅ Email validation (ADDED)
  if (!signUpField.email.trim()) {
    newErrors.email = "Email required";
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpField.email)) {
    newErrors.email = "Enter a valid email";
    hasError = true;
  }

  // ✅ Password validation (ADDED)
  if (!signUpField.password) {
    newErrors.password = "Password required";
    hasError = true;
  } else if (signUpField.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
    hasError = true;
  }

  // Stop if validation fails
  if (hasError) {
    setErrors(newErrors);
    return;
  }

  // API call
  try {
    await api.post("/auth/signup", {
      channelName: signUpField.channelName.trim(),
      userName: signUpField.userName.trim(),
      email: signUpField.email.trim(),
      password: signUpField.password,
      about: signUpField.about.trim(),
      profilePic: signUpField.profilePic
    });

    toast.success("Signup successful! Redirecting to login...");

    setTimeout(() => navigate("/login"), 2000);
  } catch (err) {
    toast.error(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className='signUp'>
      <div className="signup_card">
        <div className="signUp_title">
          <YouTubeIcon sx={{ fontSize: "54px" }} className='login_youtubeImage' />
          <h2>Sign Up</h2>
        </div>

        <div className="signUp_Inputs">
          {/* Channel Name */}
          <div className="userNameLogin">
            <input
              type="text"
              placeholder="Channel Name"
              className="userNameLoginUserName"
              value={signUpField.channelName}
              onChange={(e) => handleInputFiled(e, "channelName")}
            />
            {/* NEW: Inline error */}
            {errors.channelName && (
              <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.channelName}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="userNameLogin">
            <input
              type="text"
              placeholder="Username"
              className="userNameLoginUserName"
              value={signUpField.userName}
              onChange={(e) => handleInputFiled(e, "userName")}
            />
            {errors.userName && (
              <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.userName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="userNameLogin">
            <input
              type="email"
              placeholder="Email"
              className="userNameLoginUserName"
              value={signUpField.email}
              onChange={(e) => handleInputFiled(e, "email")}
            />
            {errors.email && (
              <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="userNameLogin">
            <input
              type="password"
              placeholder="Password"
              className="userNameLoginUserName"
              value={signUpField.password}
              onChange={(e) => handleInputFiled(e, "password")}
            />
            {errors.password && (
              <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* About (Bio) - optional, no validation */}
          <div className="userNameLogin">
            <textarea
              placeholder="About (optional)"
              className="userNameLoginUserName"
              rows="3"
              style={{ resize: "vertical" }}
              value={signUpField.about}
              onChange={(e) => handleInputFiled(e, "about")}
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="image_upload_signup">
            <label style={{ color: "white", marginBottom: "10px", display: "block" }}>
              Upload Profile Picture
            </label>
            <input type='file' accept="image/*" onChange={uploadImage} />
            <div className='image_upload_signup_div'>
              <img 
                className='image_default_signUp' 
                src={uploadedImageUrl} 
                alt="Profile Preview"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="signUpBtns">
            <div className="signUpBtn" onClick={handleSignup}>
              Sign Up
            </div>
            <Link to={'/'} className="signUpBtn">
              Home Page
            </Link>
          </div>

          {/* Progress Bar */}
          {progressBar && (
            <Box sx={{ width: '100%', marginTop: 2 }}>
              <LinearProgress />
            </Box>
          )}
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SignUp;