


import React, { useState, useEffect } from 'react';
import './navbar.css';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VideoCallIcon from '@mui/icons-material/VideoCall';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// // NEW: Icons for theme toggle
// import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon
// import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import "@fontsource/poppins/800.css";

const Navbar = ({ setSideNavbarFunc, sideNavbar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navbarModal, setNavbarModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPic, setUserPic] = useState("https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain");
  const [userName, setUserName] = useState("");

  // NEW: Theme state
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  // Load saved theme + user data
  useEffect(() => {
  const loadUser = () => {
    const savedTheme = localStorage.getItem("appTheme") || "light";
    setTheme(savedTheme);

    const userId = localStorage.getItem("userId");
    const profilePic = localStorage.getItem("userProfilePic");
    const storedUserName = localStorage.getItem("userName");

    if (userId) {
      setIsLoggedIn(true);
      if (profilePic) setUserPic(profilePic);
      if (storedUserName) setUserName(storedUserName);
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  // Load on first render
  loadUser();

  // 🔥 Listen for login/logout changes
  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("storage", loadUser);
  };
}, []);

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("appTheme") || "light";
  //   setTheme(savedTheme);

  //   const userId = localStorage.getItem("userId");
  //   const profilePic = localStorage.getItem("userProfilePic");
  //   const storedUserName = localStorage.getItem("userName");

  //   if (userId) {
  //     setIsLoggedIn(true);
  //     if (profilePic) setUserPic(profilePic);
  //     if (storedUserName) setUserName(storedUserName);
  //   } else {
  //     setIsLoggedIn(false);
  //     setUserName("");
  //   }
  // }, []);

  // NEW: Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("appTheme", newTheme);

    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.classList.toggle('dark-theme', newTheme === "dark");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSidebar = () => {
    setSideNavbarFunc(!sideNavbar);

    const sidebar = document.querySelector('.home-sideNavbar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }

    if (sidebar && sidebar.classList.contains('active')) {
      const closeOnOverlayClick = (e) => {
        if (!sidebar.contains(e.target) && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
          setSideNavbarFunc(false);
          document.body.removeEventListener('click', closeOnOverlayClick);
        }
      };
      setTimeout(() => {
        document.body.addEventListener('click', closeOnOverlayClick);
      }, 100);
    }
  };

  const handleProfileClick = () => {
    setNavbarModal(prev => !prev);
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("hasChannel");
  navigate("/login");
};

  return (
    <div className='navbar'>
      {/* Left Section */}
      <div className="navbar-left">
        <div className="navbarHamberger" onClick={toggleSidebar}>
          <MenuIcon sx={{ color: "white" }} />
        </div>
        <Link to={'/'} className="navbar_youtubeImg">
          <YouTubeIcon sx={{ fontSize: "34px" }} className='navbar_youtubeImage' />
          <div className='navbar_utubeTitle'>YouTube</div>
        </Link>
      </div>

      {/* Middle Section */}
      <div className="navbar-middle">
        <div className="navbar_searchBox">
          <input
            type="text"
            placeholder="Search"
            className="navbar_searchBoxInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="navbar_searchIconBox" onClick={handleSearch}>
            <SearchIcon sx={{ color: "white" }} />
          </div>
        </div>
        <div className="navbar_mike">
          <KeyboardVoiceIcon sx={{ color: "white" }} />
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
       <Link 
  to="/upload" 
  style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px',      // space between icon and text
    color: 'white',   // text color
    textDecoration: 'none', // remove underline
    fontWeight: '500',
    fontSize: '14px'
  }}
>
  <VideoCallIcon sx={{ fontSize: "30px", color: "white" }} />
  <span>Login</span>
</Link>


      
    <div
  className="navbar-profile-section"
  onClick={handleProfileClick}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer'
  }}
>
  {isLoggedIn && (
    <>
      <img
        src={userPic}
        alt="Profile"
        className='navbar-right-logo'
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />
      <span
        style={{
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '120px'
        }}
      >
        {userName || "My Channel"}
      </span>
    </>
  )}
</div>


        {/* Profile Dropdown - UPDATED WITH "Create Channel" OPTION */}
        {navbarModal && (
          <div className='navbar-modal'>
            {isLoggedIn ? (
              <>
                {/* NEW: "Create Channel" option - only shown if user hasn't created a channel yet */}
                {/* We use localStorage 'hasChannel' flag set after successful channel creation */}
                {localStorage.getItem('hasChannel') !== 'true' && (
                  <div
                    className="navbar-modal-option"
                    onClick={() => {
                      setNavbarModal(false); // Close dropdown smoothly
                      navigate('/create-channel');
                    }}
                    
                  >
                    Create Channel {/* NEW */}
                  </div>
                )}

                {/* Existing: Go to user's channel/profile page */}
                <div
                  className="navbar-modal-option"
                  onClick={() => {
                    setNavbarModal(false);
                    navigate(`/user/${localStorage.getItem("userId")}`);
                  }}
                >
                  Your Channel
                </div>

                {/* Logout */}
                <div className="navbar-modal-option" onClick={handleLogout}>
                  Logout
                </div>
              </>
            ) : (
              <div className="navbar-modal-option" onClick={() => navigate('/login')}>
                Sign In
              </div>
            )}
          </div>
        )}
      </div>

      {login && <Login setLoginModal={() => setLogin(false)} />}
    </div>
  );
};

export default Navbar;

