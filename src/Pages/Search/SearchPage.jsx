


import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../utils/axiosInstance'; // ← Updated: Use api instance
import './SearchPage.css'; // Create this CSS
import "@fontsource/poppins/800.css";

const SearchPage = ({ sideNavbar }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query) {
     api.get(`/api/videos/search?q=${query}`)
        .then(res => setResults(res.data.videos))
        .catch(() => {
          // Fallback: filter from all videos if no backend search
         api.get('/api/videos').then(all => { // ← Updated: Use api
            setResults(all.data.videos.filter(v => 
              v.title.toLowerCase().includes(query.toLowerCase())
            ));
          });
        });
    }
  }, [query]);

  return (
    <div className={sideNavbar ? 'homePage' : 'fullHomePage'}>
      <div className="search_results_grid">
        {results.map(item => (
          <Link to={`/watch/${item._id}`} key={item._id} className="youtube_Video">
            <div className="youtube_thumbnailBox">
              <img src={item.thumbnail} className="youtube_thumbnailPic" />
            </div>
            <div className="youtubeTitleBox_Title">
              <div className="youtube_videoTitle">{item.title}</div>
              <div className="youtube_channelName">{item.user?.channelName}</div>
             <div className="youtubeVideo_views">
  {item.views || 0} views •{" "}
  {item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : "Just now"}
</div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;