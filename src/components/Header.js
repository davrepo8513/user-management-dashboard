import React from 'react';
import { FaUsers, FaGithub, FaLinkedin } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <FaUsers className="logo-icon" />
            <h1>UserManager Pro</h1>
          </div>
          <nav className="nav">
            <a href="#dashboard" className="nav-link active">Dashboard</a>
            {/* <a href="#users" className="nav-link">Users</a>
            <a href="#analytics" className="nav-link">Analytics</a> */}
          </nav>
        </div>
        
        <div className="header-right">
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <FaLinkedin />
            </a>
          </div>
          <div className="user-profile">
            <div className="avatar">
              <span>AD</span>
            </div>
            <span className="username">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;