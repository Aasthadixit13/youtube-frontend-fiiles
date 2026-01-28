import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import "./watch.css";
import "@fontsource/poppins/800.css";

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/api/videos/${id}`);
        setVideo(res.data.video);
        setLoading(false);
      } catch (err) {
        console.error("Fetch video error:", err);
        setError("Failed to load video. It may not exist or server error.");
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <div className="watch-loading">Loading video...</div>;

  if (error) return <div className="watch-error">{error}</div>;

  if (!video) return <div className="watch-error">Video not found</div>;

  return (
    <div className="watchPage">
      {/* Video Player */}
      <div className="watch-video-container">
        <video
          src={video.videoUrl}
          poster={video.thumbnail}
          controls
          autoPlay
          className="watch_video"
          onError={(e) => console.error("Video load error:", e)}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Info */}
      <div className="watch-info">
        <h1>{video.title}</h1>
        <p className="watch-meta">
          {video.views || 0} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>
        <p className="watch-description">{video.description}</p>

        {/* Channel Info */}
        {video.user && (
          <div className="watch-channel">
            <img
              src={video.user.profilePic}
              alt="Channel"
              className="watch-channel-pic"
            />
            <span>{video.user.channelName || "Unknown Channel"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;