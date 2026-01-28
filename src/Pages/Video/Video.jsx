import React, { useState, useEffect, useRef } from "react";
import "./video.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "cloudinary-video-player/cld-video-player.min.css";
import "@fontsource/poppins/800.css";

const Video = () => {
  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  // Like / Dislike
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [userHasDisliked, setUserHasDisliked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  // Related videos
  const [relatedVideos, setRelatedVideos] = useState([]);

  // Cloudinary
  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const CLOUD_NAME = "dhlklhfgj";

  const getPublicId = (url) => {
    if (!url) return "";
    const parts = url.split("/upload/");
    if (parts.length < 2) return "";
    return parts[1].replace(/v\d+\//, "").replace(/\.[^.]+$/, "");
  };

  // Fetch video
  const fetchVideoById = async () => {
    try {
      const res = await api.get(`/api/videos/${id}`);
      const video = res.data.video;

      setData(video);
      setLikesCount(video.likes?.length || 0);
      setDislikesCount(video.dislikes?.length || 0);
      setUserHasLiked(video.likes?.includes(currentUserId));
      setUserHasDisliked(video.dislikes?.includes(currentUserId));
    } catch {
      toast.error("Failed to load video");
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/comments/${id}`);
      setComments(res.data.comments || []);
    } catch {
      console.log("Failed to fetch comments");
    }
  };

  // Related videos
  const fetchRelatedVideos = async () => {
    try {
      const res = await api.get("/api/videos");
      const videos = res.data.videos.filter((v) => v._id !== id);
      setRelatedVideos(videos.slice(0, 10));
    } catch {
      setRelatedVideos([]);
    }
  };

  // Like / Dislike
  const handleLikeDislike = async (type) => {
    if (!currentUserId) {
      toast.error("Login required");
      return;
    }

    if (loadingLike) return;
    setLoadingLike(true);

    try {
      const res = await api.post(`/api/videos/${id}/like`, { type });
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setUserHasLiked(res.data.userHasLiked);
      setUserHasDisliked(res.data.userHasDisliked);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingLike(false);
    }
  };

  // ✅ ADD COMMENT (UPDATED LOGIC)
  const addComment = async () => {
  if (!text.trim()) return;

  try {
    const res = await api.post(`/api/comments`, {
      message: text,
      video: id,
    });

    setComments([res.data.comment, ...comments]);
    setText("");
  } catch {
    toast.error("Failed to add comment");
  }
};

  // Cloudinary setup
  useEffect(() => {
    if (!data?.videoUrl || !playerRef.current || !window.cloudinary) return;

    const publicId = getPublicId(data.videoUrl);
    if (!publicId) return;

    if (playerInstance.current) playerInstance.current.dispose();

    playerInstance.current = window.cloudinary.videoPlayer(playerRef.current, {
      cloud_name: CLOUD_NAME,
      public_id: publicId,
      controls: true,
      fluid: true,
    });

    return () => {
      if (playerInstance.current) playerInstance.current.dispose();
    };
  }, [data]);

  useEffect(() => {
    fetchVideoById();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (data) fetchRelatedVideos();
  }, [data]);

  return (
    <div className="video">
      <div className="videoPostSection">
        {/* Player */}
        <div className="video_youtube">
          <div ref={playerRef} className="cld-video-player cld-fluid" />
        </div>

        {data && (
          <div className="video-info">
            <h2>{data.title}</h2>

            <div className="video-meta">
              <span>{data.views || 0} views</span>
              <span> • </span>
              <span>
                {data.createdAt
                  ? new Date(data.createdAt).toLocaleDateString()
                  : "Unknown date"}
              </span>
            </div>

            <p>{data.description}</p>

            {/* Like / Dislike */}
            <div className="video-actions">
              <button onClick={() => handleLikeDislike("like")} disabled={loadingLike}>
                <ThumbUpIcon sx={{ color: userHasLiked ? "#065fd4" : "white" }} />
                {likesCount}
              </button>

              <button onClick={() => handleLikeDislike("dislike")} disabled={loadingLike}>
                <ThumbDownAltIcon
                  sx={{ color: userHasDisliked ? "#065fd4" : "white" }}
                />
                {dislikesCount}
              </button>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="comments-section">
          <h3>Comments</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={addComment}>Post</button>

          {comments.length ? (
            comments.map((c) => (
              <div key={c._id} className="comment">
                <p>{c.text || c.message}</p>
                <small>{c.user?.userName || "User"}</small>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>

      {/* Related */}
      <div className="videoSuggestions">
        <h3>Related Videos</h3>
        {relatedVideos.map((v) => (
          <Link key={v._id} to={`/watch/${v._id}`}>
            <img src={v.thumbnail} alt={v.title} />
            <p>{v.title}</p>
          </Link>
        ))}
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default Video;
