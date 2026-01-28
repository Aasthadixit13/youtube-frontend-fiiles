import React from 'react';
import Login from '../../Component/Login/Login';
import "@fontsource/poppins/800.css";

const LoginPage = () => {
  return (
    <div
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Removed unused setLoginModal prop */}
      <Login />
    </div>
  );
};

export default LoginPage;