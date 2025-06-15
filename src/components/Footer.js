import React from 'react';
import { FaHeart, FaReact, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>UserManager Pro</h3>
            <p>A comprehensive user management solution built with React and modern web technologies.</p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>User CRUD Operations</li>
              <li>Advanced Search & Filter</li>
              <li>Responsive Design</li>
              <li>Real-time Updates</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Technology Stack</h4>
            <ul>
              <li>React 19</li>
              <li>TanStack Table</li>
              <li>Axios</li>
              <li>React Modal</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>API</h4>
            <p>Powered by JSONPlaceholder</p>
            <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noopener noreferrer" className="api-link">
              jsonplaceholder.typicode.com
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-credits">
            <p>
              Made with <FaHeart className="heart-icon" /> using <FaReact className="react-icon" /> React
            </p>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2024 UserManager Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;