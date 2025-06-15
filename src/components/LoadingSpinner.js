import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className="spinner-wrapper">
        <FaSpinner className="spinner-icon" />
        <div className="spinner-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;