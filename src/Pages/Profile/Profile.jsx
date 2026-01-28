import React, { useState, useEffect } from 'react';
import './profile.css';
import SideNavbar from '../../Component/SideNavbar/SideNavbar';
import api from '../../utils/axiosInstance';
import { Link, useParams, useNavigate } from 'react-router-dom';
import "@fontsource/poppins/800.css";

const Profile = ({ sideNavbar }) => {
  const { id } = useParams(); // User ID from URL
  const navigate = useNavigate();

  const [user, setUser] = useState(null);          // User info
  const [channel, setChannel] = useState(null);    // Channel info (banner, subs, etc.)
  const [videos, setVideos] = useState([]);        // User's uploaded videos

  const currentUserId = localStorage.getItem("userId");

  const fetchProfileData = async () => {
    try {
      // 1. Fetch user details
      const userRes = await api.get(`/api/users/user/${id}`);
      setUser(userRes.data.user);

      // 2. Fetch channel details (using your existing endpoint)
      const channelRes = await api.get(`/api/channels/${id}`);
      setChannel(channelRes.data.channel);

      // 3. Fetch user's videos
      const videosRes = await api.get(`/api/users/userVideos/${id}`);
      setVideos(videosRes.data.videos || []);
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Optional: toast.error("Failed to load profile");
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await api.delete(`/api/videos/${videoId}`);
        setVideos(videos.filter((v) => v._id !== videoId));
        toast.success("Video deleted successfully");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Failed to delete video");
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  return (
    <div className="profile">
      <SideNavbar sideNavbar={sideNavbar} />

      {/* <div className={sideNavbar ? "profile_page" : "profile_page_inactive"}> */}
      <div className="profile_container">
        <div className="profile_card">
        
        {/* Channel Banner */}
        <div className="profile_banner_section">
         <img
  src={
    channel?.channelBanner && channel.channelBanner.trim() !== ""
      ? channel.channelBanner
      : "https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg"
  }
  alt="Channel Banner"
  className="profile_banner_img"
/>

        </div>

        {/* Profile Header - Avatar + Info */}
        <div className="profile_header">
          <img
  src={
    user?.profilePic && user.profilePic.trim() !== ""
      ? user.profilePic
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  alt="Profile"
  className="profile_avatar_large"
/>


          <div className="profile_info">
            <h1>
              {channel?.channelName || user?.channelName || "Channel Name"}
            </h1>
            <p className="subscribers_count">
              {channel?.subscribers?.length || 0} subscribers
            </p>
            <p className="profile_description">
              {channel?.description || user?.about || "No description yet"}
            </p>
          </div>
        </div>

        {/* Videos Section */}
        <div className="profile_videos">
          <h2>Videos</h2>
          <div className="profileVideos">
            {videos.length > 0 ? (
              videos.map((item) => (
                <Link
                  to={`/watch/${item._id}`}
                  key={item._id}
                  className="profileVideo_block"
                >
                  <div className="profileVideo_block_thumbnail">
                   <img
  src={
    item.thumbnail && item.thumbnail.trim() !== ""
      ? item.thumbnail
      : "https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg"
  }
  alt={item.title}
  className="profileVideo_block_thumbnail_img"
/>

                  </div>

                  <div className="profileVideo_block_detail">
                    <div className="profileVideo_block_detail_name">
                      {item.title}
                    </div>
                    <div className="profileVideo_block_detail_about">
                      {item.views || 0} views •{" "}
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Just now"}
                    </div>

                    {/* Edit/Delete buttons - only for own videos */}
                    {item.user?._id === currentUserId && (
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Prevent link navigation
                            navigate(`/edit/${item._id}`);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                          style={{ color: "red" }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p
                style={{
                  color: "white",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                No videos uploaded yet
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;