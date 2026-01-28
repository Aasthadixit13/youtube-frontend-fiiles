


import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance'; // ← Updated: Use api instance
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "@fontsource/poppins/800.css";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState({ title: "", description: "" });

  useEffect(() => {
   api.get(`/api/videos/${id}`)
      .then(res => setVideo(res.data.video));
  }, [id]);

  const handleSave = async () => {
    await api.put(`/api/videos/${id}`, video); // ← Updated: Use api
    toast.success("Video updated!");
    navigate(`/user/${localStorage.getItem("userId")}`);
  };

  return (
    <div>
      <h2>Edit Video</h2>
      <input
        value={video.title}
        onChange={(e) => setVideo({ ...video, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={video.description}
        onChange={(e) => setVideo({ ...video, description: e.target.value })}
        placeholder="Description"
      />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditVideo;