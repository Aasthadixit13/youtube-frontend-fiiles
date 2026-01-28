
import React, { useState, useEffect } from 'react';
import './homePage.css';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/axiosInstance';
import "@fontsource/poppins/800.css";


const HomePage = ({ sideNavbar }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("category") || "All";

  const options = [
    "All", "Music", "Gaming", "Live", "Cricket", "Comedy",
    "Movies", "News", "Cooking", "Tech", "Education"
  ];

  const staticVideos = [
    {
      _id: "1",
      title: "Learn React in 30 Minutes",
      thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg",
      views: 15200,
      createdAt: "2024-09-20",
      videoType: "Education",
      user: {
        channelName: "Code Evolution",
        profilePic: "https://via.placeholder.com/50"
      }
    }
  ];

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/api/videos');
        const videos = res.data.videos || [];
        setData(videos);
      } catch (error) {
        console.log("API failed, using static videos");
        setData(staticVideos);
      }
    };
    fetchVideos();
  }, []);

  // Filter videos based on URL
  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(video =>
          video.videoType?.toLowerCase() === activeFilter.toLowerCase()
        )
      );
    }
  }, [data, activeFilter]);

  return (
    <div className={sideNavbar ? 'homePage' : 'fullHomePage'}>
      
      {/* Filter Buttons */}
      <div className="homePage_options">
        {options.map((item, index) => (
          <div
            key={index}
            className="homePage_option"
            style={{
              backgroundColor: activeFilter === item ? "white" : "rgb(42,42,42)",
              color: activeFilter === item ? "black" : "white"
            }}
            onClick={() =>
              setSearchParams(
                item === "All" ? {} : { category: item }
              )
            }
          >
            {item}
          </div>
        ))}
      </div>

      {/* Video Grid */}
      <div className={sideNavbar ? "home_mainPage" : "home_mainPageWithoutLink"}>
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <Link
              to={`/watch/${item._id}`}
              key={item._id}
              className="youtube_Video"
            >
              <div className="youtube_thumbnailBox">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="youtube_thumbnailPic"
                />
              </div>

              <div className="youtubeTitleBox">
                <img
                  src={item.user?.profilePic || "https://via.placeholder.com/50"}
                  alt=""
                  className="youtube_thumbnail_Profile"
                />
                <div>
                  <div className="youtube_videoTitle">{item.title}</div>
                  <div className="youtube_channelName">
                    {item.user?.channelName || "Unknown Channel"}
                  </div>
                  <div className="youtubeVideo_views">
                    {item.views || 0} views •{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "Just now"}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ color: "white", textAlign: "center" }}>
            No videos found
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
