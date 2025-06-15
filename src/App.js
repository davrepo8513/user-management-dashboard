import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
// import Footer from './components/Footer';
import UserTable from './components/UserTable';
import UserFormModal from './components/UserFormModal';
import ConfirmDialog from './components/ConfirmDialog';
import LoadingSpinner from './components/LoadingSpinner';
import Toast from './components/Toast';
import { FaPlus, FaUsers, FaChartBar, FaSync } from 'react-icons/fa';
import './App.css';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Toast states
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setUsers(response.data);
      showToast('Users loaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to fetch users. Please try again.', 'error');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setActionLoading(true);
      
      if (editingUser) {
        // Update existing user
        const response = await axios.put(`${API_BASE_URL}/${editingUser.id}`, {
          ...formData,
          id: editingUser.id
        });
        
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id ? response.data : user
        ));
        
        showToast('User updated successfully!', 'success');
      } else {
        // Add new user
        const newUser = {
          ...formData,
          id: Math.max(...users.map(u => u.id), 0) + 1 // Generate next ID
        };
        
        const response = await axios.post(API_BASE_URL, newUser);
        
        // Since JSONPlaceholder returns the posted data with id: 101, we'll use our generated ID
        const addedUser = { ...response.data, id: newUser.id };
        setUsers(prev => [...prev, addedUser]);
        showToast('User added successfully!', 'success');
      }
      
      setIsFormModalOpen(false);
      setEditingUser(null);
      
    } catch (err) {
      showToast(
        editingUser ? 'Failed to update user. Please try again.' : 'Failed to add user. Please try again.',
        'error'
      );
      console.error('Error saving user:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setActionLoading(true);
      await axios.delete(`${API_BASE_URL}/${userToDelete.id}`);
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      showToast('User deleted successfully!', 'success');
    } catch (err) {
      showToast('Failed to delete user. Please try again.', 'error');
      console.error('Error deleting user:', err);
    } finally {
      setActionLoading(false);
      setUserToDelete(null);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="App">
        <Header />
        <main className="main-content">
          <LoadingSpinner message="Loading users..." size="large" />
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="dashboard-title">
              <h1>
                <FaUsers className="title-icon" />
                User Management Dashboard
              </h1>
              <p>Manage your users with full CRUD operations</p>
            </div>
            
            <div className="dashboard-actions">
              <button
                onClick={handleRefresh}
                className="btn btn-secondary"
                disabled={loading}
                title="Refresh users"
              >
                <FaSync className={loading ? 'spinning' : ''} />
                Refresh
              </button>
              <button
                onClick={handleAddUser}
                className="btn btn-primary"
              >
                <FaPlus />
                Add New User
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon active">
                <FaChartBar />
              </div>
              <div className="stat-content">
                <h3>{users.filter(u => u.company?.name).length}</h3>
                <p>With Companies</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon verified">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{users.filter(u => u.website).length}</h3>
                <p>With Websites</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            editingUserId={editingUser?.id}
          />
        </div>
      </main>

      {/* <Footer /> */}

      {/* Modals */}
      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={editingUser}
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        position="top-right"
      />

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="loading-overlay">
          <LoadingSpinner message="Processing..." size="medium" />
        </div>
      )}
    </div>
  );
}

export default App;
