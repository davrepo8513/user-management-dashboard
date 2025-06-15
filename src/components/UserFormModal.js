import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import './UserFormModal.css';

// Set the app element for accessibility
Modal.setAppElement('#root');

const UserFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user, 
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    website: '',
    address: {
      street: '',
      suite: '',
      city: '',
      zipcode: '',
      geo: {
        lat: '',
        lng: ''
      }
    },
    company: {
      name: '',
      catchPhrase: '',
      bs: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        website: user.website || '',
        address: {
          street: user.address?.street || '',
          suite: user.address?.suite || '',
          city: user.address?.city || '',
          zipcode: user.address?.zipcode || '',
          geo: {
            lat: user.address?.geo?.lat || '',
            lng: user.address?.geo?.lng || ''
          }
        },
        company: {
          name: user.company?.name || '',
          catchPhrase: user.company?.catchPhrase || '',
          bs: user.company?.bs || ''
        }
      });
    } else {
      resetForm();
    }
  }, [user, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      phone: '',
      website: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '',
          lng: ''
        }
      },
      company: {
        name: '',
        catchPhrase: '',
        bs: ''
      }
    });
    setErrors({});
    setActiveTab('basic');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    const errorKey = name.includes('.') ? name.split('.').pop() : name;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (include http:// or https://)';
    }

    if (formData.address.geo.lat && (isNaN(formData.address.geo.lat) || Math.abs(formData.address.geo.lat) > 90)) {
      newErrors.lat = 'Latitude must be a number between -90 and 90';
    }

    if (formData.address.geo.lng && (isNaN(formData.address.geo.lng) || Math.abs(formData.address.geo.lng) > 180)) {
      newErrors.lng = 'Longitude must be a number between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="user-modal"
      overlayClassName="user-modal-overlay"
      closeTimeoutMS={300}
    >
      <div className="modal-header">
        <h2>
          <FaUser className="modal-icon" />
          {user ? 'Edit User' : 'Add New User'}
        </h2>
        <button onClick={handleClose} className="close-button">
          <FaTimes />
        </button>
      </div>

      <div className="modal-tabs">
        <button
          className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <FaUser /> Basic Info
        </button>
        <button
          className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
          onClick={() => setActiveTab('address')}
        >
          <FaMapMarkerAlt /> Address
        </button>
        <button
          className={`tab-button ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <FaBuilding /> Company
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-body">
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter full name"
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">
                    <FaUser /> Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={errors.username ? 'error' : ''}
                    placeholder="Enter username"
                  />
                  {errors.username && <span className="field-error">{errors.username}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter email address"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <FaPhone /> Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website">
                  <FaGlobe /> Website
                </label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className={errors.website ? 'error' : ''}
                  placeholder="https://example.com"
                />
                {errors.website && <span className="field-error">{errors.website}</span>}
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.street">Street</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.suite">Suite</label>
                  <input
                    type="text"
                    id="address.suite"
                    name="address.suite"
                    value={formData.address.suite}
                    onChange={handleInputChange}
                    placeholder="Apt, Suite, etc."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.city">City</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.zipcode">Zipcode</label>
                  <input
                    type="text"
                    id="address.zipcode"
                    name="address.zipcode"
                    value={formData.address.zipcode}
                    onChange={handleInputChange}
                    placeholder="Enter zipcode"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.geo.lat">Latitude</label>
                  <input
                    type="text"
                    id="address.geo.lat"
                    name="address.geo.lat"
                    value={formData.address.geo.lat}
                    onChange={handleInputChange}
                    className={errors.lat ? 'error' : ''}
                    placeholder="e.g., -37.3159"
                  />
                  {errors.lat && <span className="field-error">{errors.lat}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address.geo.lng">Longitude</label>
                  <input
                    type="text"
                    id="address.geo.lng"
                    name="address.geo.lng"
                    value={formData.address.geo.lng}
                    onChange={handleInputChange}
                    className={errors.lng ? 'error' : ''}
                    placeholder="e.g., 81.1496"
                  />
                  {errors.lng && <span className="field-error">{errors.lng}</span>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="tab-content">
              <div className="form-group">
                <label htmlFor="company.name">Company Name</label>
                <input
                  type="text"
                  id="company.name"
                  name="company.name"
                  value={formData.company.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company.catchPhrase">Catch Phrase</label>
                <input
                  type="text"
                  id="company.catchPhrase"
                  name="company.catchPhrase"
                  value={formData.company.catchPhrase}
                  onChange={handleInputChange}
                  placeholder="Enter company catch phrase"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company.bs">Business</label>
                <input
                  type="text"
                  id="company.bs"
                  name="company.bs"
                  value={formData.company.bs}
                  onChange={handleInputChange}
                  placeholder="Enter business description"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (user ? 'Update User' : 'Add User')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;