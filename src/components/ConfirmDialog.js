import React from 'react';
import Modal from 'react-modal';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return { icon: FaExclamationTriangle, color: '#dc3545' };
      case 'warning':
        return { icon: FaExclamationTriangle, color: '#ffc107' };
      case 'info':
        return { icon: FaExclamationTriangle, color: '#17a2b8' };
      default:
        return { icon: FaExclamationTriangle, color: '#dc3545' };
    }
  };

  const { icon: Icon, color } = getIconAndColor();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="confirm-dialog"
      overlayClassName="confirm-dialog-overlay"
      closeTimeoutMS={200}
    >
      <div className="dialog-header">
        <div className="dialog-icon" style={{ color }}>
          <Icon />
        </div>
        <button onClick={onClose} className="close-button">
          <FaTimes />
        </button>
      </div>

      <div className="dialog-body">
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
      </div>

      <div className="dialog-footer">
        <button
          onClick={onClose}
          className="btn btn-secondary"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`btn btn-${type}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;