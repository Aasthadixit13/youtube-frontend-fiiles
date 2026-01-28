// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Components & Pages
import Navbar from './Component/Navbar/Navbar';
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';
import Profile from './Pages/Profile/Profile';
import VideoUpload from './Pages/VideoUpload/VideoUpload';
import SignUp from './Pages/SignUp/SignUp';
import LoginPage from './Pages/LoginPage/LoginPage';
import SearchPage from './Pages/Search/SearchPage';
import EditVideo from './Pages/EditVideo/EditVideo';
import PrivateRoute from './Component/Routes/PrivateRoute';
import CreateChannel from './Pages/CreateChannel/CreateChannel';
import Register from './Component/Login/Register';

import "@fontsource/poppins/800.css";

function App() {
  const [sideNavbar, setSideNavbar] = useState(true);

  // ✅ VITE env vars (works only in Vite)
  console.log("VITE API URL:", import.meta.env.VITE_API_URL);
  console.log("VITE Cloudinary Cloud Name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  console.log("VITE Cloudinary Upload Preset:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  return (
    <div className="app-container">
      <div className="App">
        <Navbar setSideNavbarFunc={setSideNavbar} sideNavbar={sideNavbar} />
        <Routes>
          <Route path="/" element={<Home sideNavbar={sideNavbar} />} />
          <Route path="/watch/:id" element={<Video />} />
          <Route path="/user/:id" element={<Profile sideNavbar={sideNavbar} />} />

          {/* Protected Upload Route */}
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <VideoUpload />
              </PrivateRoute>
            }
          />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage sideNavbar={sideNavbar} />} />
          <Route path="/edit/:id" element={<EditVideo />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Create Channel Route */}
          <Route
            path="/create-channel"
            element={
              <PrivateRoute>
                <CreateChannel />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
