import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    user: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.users);
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      user: user.user
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await adminAPI.updateUser(editingUser._id, editForm);
      toast.success('User updated successfully! 🎉');
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted successfully! 🗑️');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    try {
      await Promise.all(selectedUsers.map(id => adminAPI.deleteUser(id)));
      toast.success(`${selectedUsers.length} user(s) deleted successfully!`);
      setSelectedUsers([]);
      fetchUsers();
    } catch {
      toast.error('Bulk delete failed');
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await adminAPI.deleteUserImage(id);
      toast.success('Profile image removed! 📸');
      fetchUsers();
    } catch {
      toast.error('Image delete failed');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'all' ? true : u.user === filter;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.user === 'admin').length,
    users: users.filter(u => u.user === 'user').length,
    verified: users.filter(u => u.isVerified).length
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Animated background */}
      <div style={styles.bgGradient}></div>
      
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <div style={styles.headerIcon}>
              <svg style={styles.adminIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>Manage users, roles, and permissions</p>
          </div>

          <div style={styles.headerActions}>
            <Link to="/profile" style={styles.profileBtn}>
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Profile
            </Link>
            <button onClick={logout} style={styles.logoutBtn}>
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconWrapper}>
              <svg style={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p style={styles.statLabel}>Total Users</p>
              <p style={styles.statValue}>{stats.total}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconWrapper, background: '#3b82f6'}}>
              <svg style={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p style={styles.statLabel}>Verified Users</p>
              <p style={styles.statValue}>{stats.verified}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconWrapper, background: '#10b981'}}>
              <svg style={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p style={styles.statLabel}>Regular Users</p>
              <p style={styles.statValue}>{stats.users}</p>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIconWrapper, background: '#8b5cf6'}}>
              <svg style={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p style={styles.statLabel}>Administrators</p>
              <p style={styles.statValue}>{stats.admins}</p>
            </div>
          </div>
        </div>

        {/* FILTER AND SEARCH */}
        <div style={styles.controlsBar}>
          <div style={styles.filterGroup}>
            <button 
              onClick={() => setFilter('all')} 
              style={filter === 'all' ? styles.activeFilterBtn : styles.filterBtn}
            >
              All Users
            </button>
            <button 
              onClick={() => setFilter('user')} 
              style={filter === 'user' ? styles.activeFilterBtn : styles.filterBtn}
            >
              Regular
            </button>
            <button 
              onClick={() => setFilter('admin')} 
              style={filter === 'admin' ? styles.activeFilterBtn : styles.filterBtn}
            >
              Admins
            </button>
          </div>

          <div style={styles.searchBox}>
            <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {selectedUsers.length > 0 && (
            <button onClick={handleBulkDelete} style={styles.bulkDeleteBtn}>
              <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected ({selectedUsers.length})
            </button>
          )}
        </div>

        {/* TABLE */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={{width: '40px'}}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    style={styles.checkbox}
                  />
                </th>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Member Since</th>
                <th>Actions</th>
               </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u._id} style={{...styles.tableRow, ...(index % 2 === 0 ? styles.rowEven : styles.rowOdd)}}>
                  <td style={{textAlign: 'center'}}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u._id)}
                      onChange={() => handleSelectUser(u._id)}
                      style={styles.checkbox}
                    />
                   </td>
                  
                  {/* IMAGE */}
                  <td>
                    <div style={styles.imageCell}>
                      {u.profileImage ? (
                        <>
                          <img
                            src={`http://localhost:3000${u.profileImage}`}
                            alt={u.name}
                            style={styles.userImage}
                          />
                          <button
                            onClick={() => handleDeleteImage(u._id)}
                            style={styles.imageRemoveBtn}
                            title="Remove image"
                          >
                            <svg style={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div style={styles.noImage}>
                          <svg style={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* NAME */}
                  <td style={styles.nameCell}>
                    <span style={styles.userName}>{u.name}</span>
                  </td>

                  {/* EMAIL */}
                  <td>
                    <span style={styles.userEmail}>{u.email}</span>
                  </td>

                  {/* ROLE */}
                  <td>
                    <span style={u.user === 'admin' ? styles.adminBadge : styles.userBadge}>
                      {u.user === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>

                  {/* VERIFIED */}
                  <td>
                    <span style={u.isVerified ? styles.verifiedBadge : styles.unverifiedBadge}>
                      {u.isVerified ? '✓ Verified' : '✗ Unverified'}
                    </span>
                  </td>

                  {/* MEMBER SINCE */}
                  <td style={styles.dateCell}>
                    {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div style={styles.actionButtons}>
                      <button onClick={() => handleEdit(u)} style={styles.editBtn} title="Edit">
                        <svg style={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button onClick={() => {
                        setUserToDelete(u);
                        setShowDeleteModal(true);
                      }} style={styles.deleteBtn} title="Delete">
                        <svg style={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div style={styles.emptyState}>
              <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p>No users found</p>
              <span>Try adjusting your search or filter criteria</span>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && editingUser && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalHeaderIcon}>
                <svg style={styles.modalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 style={styles.modalTitle}>Edit User</h2>
              <button onClick={() => setShowEditModal(false)} style={styles.modalClose}>
                <svg style={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalUserInfo}>
                <div style={styles.modalAvatar}>
                  {editingUser.profileImage ? (
                    <img
                      src={`http://localhost:3000${editingUser.profileImage}`}
                      alt={editingUser.name}
                      style={styles.modalAvatarImg}
                    />
                  ) : (
                    <div style={styles.modalAvatarPlaceholder}>
                      <span>{editingUser.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p style={styles.modalUserId}>User ID: {editingUser._id}</p>
                  <p style={styles.modalUserStatus}>
                    Status: {editingUser.isVerified ? 'Verified ✓' : 'Unverified ✗'}
                  </p>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={styles.modalInput}
                  placeholder="Enter full name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={styles.modalInput}
                  placeholder="Enter email address"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  User Role
                </label>
                <select
                  value={editForm.user}
                  onChange={(e) => setEditForm({ ...editForm, user: e.target.value })}
                  style={styles.modalSelect}
                >
                  <option value="user">👤 Regular User</option>
                  <option value="admin">👑 Administrator</option>
                </select>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowEditModal(false)} style={styles.modalCancelBtn}>
                Cancel
              </button>
              <button onClick={handleUpdate} style={styles.modalSaveBtn}>
                <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && userToDelete && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={{...styles.modal, maxWidth: '450px'}} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{...styles.modalHeaderIcon, background: '#ef4444'}}>
                <svg style={styles.modalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 style={styles.modalTitle}>Delete User</h2>
              <button onClick={() => setShowDeleteModal(false)} style={styles.modalClose}>
                <svg style={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.deleteWarning}>
                <svg style={styles.warningIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p style={styles.deleteText}>
                  Are you sure you want to delete <strong>{userToDelete.name}</strong>?
                </p>
                <p style={styles.deleteSubtext}>
                  This action cannot be undone. All user data will be permanently removed.
                </p>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowDeleteModal(false)} style={styles.modalCancelBtn}>
                Cancel
              </button>
              <button onClick={() => handleDelete(userToDelete._id)} style={styles.modalDeleteBtn}>
                <svg style={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    padding: '24px',
    position: 'relative',
  },
  
  bgGradient: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: 0,
  },
  
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  loadingText: {
    marginTop: '20px',
    color: 'white',
    fontSize: '16px',
  },
  
  header: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px 32px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  
  headerIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    marginBottom: '12px',
  },
  
  adminIcon: {
    width: '20px',
    height: '20px',
    color: 'white',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  btnIcon: {
    width: '18px',
    height: '18px',
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  
  statIconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#8b5cf6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statIcon: {
    width: '24px',
    height: '24px',
    color: 'white',
  },
  
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px',
  },
  
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  
  controlsBar: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px 24px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  
  filterGroup: {
    display: 'flex',
    gap: '8px',
  },
  
  filterBtn: {
    padding: '8px 16px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '10px',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  
  activeFilterBtn: {
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '500',
  },
  
  searchBox: {
    flex: 1,
    maxWidth: '300px',
    position: 'relative',
  },
  
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '18px',
    height: '18px',
    color: '#94a3b8',
  },
  
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  
  bulkDeleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  
  tableContainer: {
    background: 'white',
    borderRadius: '20px',
    overflow: 'auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px',
  },
  
  tableHeader: {
    background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
  },
  
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background 0.3s ease',
  },
  
  rowEven: {
    background: '#ffffff',
  },
  
  rowOdd: {
    background: '#fafbfc',
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  
  imageCell: {
    position: 'relative',
    display: 'inline-block',
  },
  
  userImage: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e2e8f0',
  },
  
  imageRemoveBtn: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  
  noImage: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
  },
  
  nameCell: {
    fontWeight: '500',
  },
  
  userName: {
    color: '#1a1a2e',
  },
  
  userEmail: {
    color: '#64748b',
    fontSize: '13px',
  },
  
  adminBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  userBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '50px',
    background: '#e2e8f0',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  verifiedBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '50px',
    background: '#10b981',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  unverifiedBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '50px',
    background: '#fbbf24',
    color: '#92400e',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  dateCell: {
    fontSize: '13px',
    color: '#64748b',
  },
  
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '12px',
    fontWeight: '500',
  },
  
  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '12px',
    fontWeight: '500',
  },
  
  smallIcon: {
    width: '14px',
    height: '14px',
    color: 'white',
  },
  
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  
  emptyIcon: {
    width: '64px',
    height: '64px',
    color: '#94a3b8',
    marginBottom: '16px',
  },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  
  modal: {
    background: 'white',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '550px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'slideUp 0.3s ease',
  },
  
  modalHeader: {
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
  },
  
  modalHeaderIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalIcon: {
    width: '20px',
    height: '20px',
    color: 'white',
  },
  
  modalTitle: {
    flex: 1,
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: 0,
  },
  
  modalClose: {
    background: '#f1f5f9',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  modalBody: {
    padding: '32px',
  },
  
  modalUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '16px',
    marginBottom: '24px',
  },
  
  modalAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  
  modalAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  
  modalAvatarPlaceholder: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
  },
  
  modalUserId: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '4px',
  },
  
  modalUserStatus: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#10b981',
  },
  
  formGroup: {
    marginBottom: '20px',
  },
  
  modalLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  
  labelIcon: {
    width: '16px',
    height: '16px',
    color: '#667eea',
  },
  
  modalInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  
  modalSelect: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: 'white',
    cursor: 'pointer',
  },
  
  modalFooter: {
    padding: '20px 32px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  
  modalCancelBtn: {
    padding: '10px 20px',
    background: '#f1f5f9',
    border: 'none',
    borderRadius: '10px',
    color: '#475569',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  modalSaveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  modalDeleteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  deleteWarning: {
    textAlign: 'center',
    padding: '20px',
  },
  
  warningIcon: {
    width: '64px',
    height: '64px',
    color: '#ef4444',
    marginBottom: '16px',
  },
  
  deleteText: {
    fontSize: '18px',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  
  deleteSubtext: {
    fontSize: '14px',
    color: '#64748b',
  },
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .profile-btn:hover, .logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .filter-btn:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }
  
  .search-input:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  .bulk-delete-btn:hover {
    background: #b91c1c;
    transform: translateY(-1px);
  }
  
  .table-row:hover {
    background: #f8fafc;
  }
  
  .edit-btn:hover, .delete-btn:hover {
    transform: translateY(-1px);
    filter: brightness(0.95);
  }
  
  .image-remove-btn:hover {
    transform: scale(1.1);
  }
  
  .modal-close:hover {
    background: #e2e8f0;
    transform: rotate(90deg);
  }
  
  .modal-cancel-btn:hover {
    background: #e2e8f0;
  }
  
  .modal-save-btn:hover, .modal-delete-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .modal-input:focus, .modal-select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

document.head.appendChild(styleSheet);

export default AdminDashboard;