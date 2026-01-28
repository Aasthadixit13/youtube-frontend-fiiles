import React, { useState, useRef } from 'react';
import './videoUpload.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "@fontsource/poppins/800.css";
import axios from "axios";   




const VideoUpload = () => {
  // 🔍 DEBUG ENV (TEMPORARY)
  console.log("API:", import.meta.env);
  console.log("CLOUD:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  console.log("PRESET:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  const [inputField, setInputField] = useState({
    title: "",
    description: "",
    videoLink: "",
    thumbnail: "",
    videoType: "",
    duration: ""   // NEW: duration in seconds
  });

  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  const navigate = useNavigate();

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleOnChangeInput = (e, name) => {
    setInputField({
      ...inputField,
      [name]: e.target.value
    });
  };

 // ================= CLOUDINARY UPLOAD =================
// ================= CLOUDINARY UPLOAD =================
const uploadImage = async (e, type) => {
  const file = e.target.files[0];
  if (!file) return;

  setLoader(true);
  setProgress(0);

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", UPLOAD_PRESET);

  try {
  let res;

  if (type === "video") {
    // 🔹 VIDEO UPLOAD (CORRECT ENDPOINT)
    res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      data,
      {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        }
      }
    );
  } else {
    // 🔹 IMAGE UPLOAD (CORRECT ENDPOINT)
    res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );
  }

    const url = res.data.secure_url;

    if (type === "video") {
      setInputField((prev) => ({ ...prev, videoLink: url }));
      toast.success("Video uploaded!");
      videoRef.current.value = "";
    } else {
      setInputField((prev) => ({ ...prev, thumbnail: url }));
      toast.success("Thumbnail uploaded!");
      thumbRef.current.value = "";
    }

  } catch (err) {
  console.error("Cloudinary error:", err.response?.data || err);
  toast.error(
    err.response?.data?.error?.message || "Cloudinary upload failed"
  );
}


finally {
    setLoader(false);
    setProgress(0);
  }
};

  // ================= SUBMIT TO BACKEND =================
  const handleSubmitFunc = async () => {
    // 🆕 ADDED: proper validation
    if (
      !inputField.title ||
      !inputField.description ||
      !inputField.videoLink ||
      !inputField.thumbnail ||
      !inputField.videoType ||
      !inputField.duration
    ) {
      toast.error("All fields are required");
      console.log(inputField);

      return;
    }

    setLoader(true);

    try {
      // 🔁 CORRECT: use api (with JWT)
      // await api.post("/api/videos", {
      //   title: inputField.title,
      //   description: inputField.description,
      //   videoUrl: inputField.videoLink,
      //   thumbnail: inputField.thumbnail,
      //   videoType: inputField.videoType,
      //   duration: Number(inputField.duration)
      // });

      await api.post("/api/videos", {
  title: inputField.title,
  description: inputField.description,
  videoUrl: inputField.videoLink, // ✅ MUST be this
  thumbnail: inputField.thumbnail,
  videoType: inputField.videoType,
  duration: Number(inputField.duration)
});
      toast.success("Video uploaded successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Backend save failed");
    } finally {
      setLoader(false);
    }
  };


  return (
    <div className='videoUpload'>
      <div className="uploadBox">
        {/* <div className="uploadVideoTitle">
          <YouTubeIcon sx={{ fontSize: "54px", color: "red" }} />
          <h2>Upload Video</h2>
        </div> */}

<div className="uploadVideoTitle">
  <YouTubeIcon style={{ fontSize: 54, color: "red" }} />
  <span>Upload Video</span>
</div>

        <div className="uploadForm">
          <input
            type="text"
            placeholder="Video Title"
            className="uploadInput"
            value={inputField.title}
            onChange={(e) => handleOnChangeInput(e, "title")}
          />

          <textarea
            placeholder="Video Description"
            className="uploadInput"
            rows="5"
            style={{ resize: "vertical" }}
            value={inputField.description}
            onChange={(e) => handleOnChangeInput(e, "description")}
          />

          <select
            className="uploadInput"
            value={inputField.videoType}
            onChange={(e) => handleOnChangeInput(e, "videoType")}
          >
            <option value="">Select Category</option>
            <option value="Music">Music</option>
            <option value="Gaming">Gaming</option>
            <option value="Tech">Tech</option>
            <option value="Education">Education</option>
            <option value="Comedy">Comedy</option>
            <option value="Cooking">Cooking</option>
            <option value="Sports">Sports</option>
            <option value="Vlogs">Vlogs</option>
          </select>

          {/* 🆕 ADDED */}
          <input
            type="number"
            placeholder="Duration in seconds"
            value={inputField.duration}
            onChange={(e) => handleOnChangeInput(e, "duration")}
          />


          <div className="uploadSection">
            <label>
              Upload Video File
            </label>
            <input
              type="file"
              accept="video/*"
              ref={videoRef}
              onChange={(e) => uploadImage(e, "video")}
            />
            {inputField.videoLink && (
              <p>
                Video uploaded & optimized successfully
              </p>
            )}
          </div>

          <div className="uploadSection">
            <label>
              Upload Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={thumbRef}
              onChange={(e) => uploadImage(e, "thumbnail")}
            />
            {inputField.thumbnail && (
              <div>
                <img
                  src={inputField.thumbnail}
                  alt="Thumbnail Preview"
                  
                />
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {loader && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <CircularProgress />
              </Box>
              <p style={{ color: "white", textAlign: "center" }}>
                Uploading: {progress}%
              </p>
            </>
          )}
        </div>

        <div className="uploadBtns">
          <button
            type="button"
            disabled={loader}
            className="uploadBtn-form"
            onClick={handleSubmitFunc}
            style={{
              opacity: loader ? 0.6 : 1,
              cursor: loader ? "not-allowed" : "pointer"
            }}
          >
            {loader ? "Processing..." : "Upload Video"}
          </button>

          {/* <Link to={'/'} className="uploadBtn-form">
            Home
          </Link> */}
          <Link
  to="/"
  className="uploadBtn-form"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none"
  }}
>
  Home
</Link>

        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default VideoUpload;