import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [multipleUploading, setMultipleUploading] = useState(false);

  useEffect(() => {}, [user]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await userAPI.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await userAPI.uploadProfileImage(formData);
      updateUser({ ...user, profileImage: res.data.profileImage });
      toast.success('Profile image uploaded! 📸');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate each file
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setMultipleUploading(true);
    const formData = new FormData();
    validFiles.forEach(file => formData.append('images', file));

    try {
      const res = await userAPI.uploadImages(formData);
      updateUser({ ...user, images: res.data.images });
      toast.success(`${validFiles.length} image(s) uploaded successfully! 🖼️`);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setMultipleUploading(false);
    }
  };

  if (!user) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading your profile...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Animated background elements */}
      <div style={styles.bgBlur1}></div>
      <div style={styles.bgBlur2}></div>
      <div style={styles.bgBlur3}></div>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerIcon}>
              <svg style={styles.headerIconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 style={styles.welcomeTitle}>
                Welcome back, <span style={styles.userName}>{user.name}</span>
              </h1>
              <p style={styles.welcomeSubtitle}>
                Manage your profile and settings
              </p>
            </div>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.profileImageContainer}>
              {user.profileImage ? (
                <img
                  src={`http://localhost:3000${user.profileImage}`}
                  alt="profile"
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.profileImagePlaceholder}>
                  <span style={styles.profileInitial}>
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <label htmlFor="profile-image-upload" style={styles.uploadIcon}>
                <svg style={styles.cameraIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  id="profile-image-upload"
                  type="file"
                  onChange={handleProfileImageUpload}
                  accept="image/*"
                  style={styles.hiddenInput}
                  disabled={imageUploading}
                />
              </label>
              {imageUploading && <div style={styles.uploadingOverlay}>Uploading...</div>}
            </div>
            <button onClick={logout} style={styles.logoutBtn}>
              <svg style={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={styles.grid}>
          {/* PROFILE FORM */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <svg style={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 style={styles.cardTitle}>Personal Information</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Full Name
                </label>
                <input
                  {...register('name')}
                  defaultValue={user.name}
                  placeholder="Enter your name"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email Address
                </label>
                <input
                  {...register('email')}
                  defaultValue={user.email}
                  placeholder="Enter your email"
                  type="email"
                  style={styles.input}
                  disabled
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Account Type
                </label>
                <div style={styles.roleBadge}>
                  <span style={user.userType === 'admin' ? styles.adminBadge : styles.userBadge}>
                    {user.userType === 'admin' ? '👑 Administrator' : '👤 Regular User'}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  ...(loading && styles.disabledBtn),
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {loading ? (
                  <>
                    <svg style={styles.spinnerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    Update Profile
                    <svg style={styles.updateIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* IMAGE GALLERY */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <svg style={styles.cardIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 style={styles.cardTitle}>Media Gallery</h2>
            </div>

            <div style={styles.uploadSection}>
              <div style={styles.uploadArea}>
                <label htmlFor="multiple-images" style={styles.uploadLabel}>
                  <svg style={styles.uploadIconLarge} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Click to upload images</span>
                  <span style={styles.uploadHint}>Supports: JPG, PNG, GIF (Max 5MB each)</span>
                  <input
                    id="multiple-images"
                    type="file"
                    multiple
                    onChange={handleImagesUpload}
                    accept="image/*"
                    style={styles.hiddenInput}
                    disabled={multipleUploading}
                  />
                </label>
                {multipleUploading && (
                  <div style={styles.uploadProgress}>
                    <div style={styles.spinnerSmall}></div>
                    <span>Uploading images...</span>
                  </div>
                )}
              </div>
            </div>

            {user.images && user.images.length > 0 ? (
              <div style={styles.galleryGrid}>
                {user.images.map((img, i) => (
                  <div key={i} style={styles.galleryItem}>
                    <img
                      src={`http://localhost:3000${img}`}
                      alt={`Upload ${i + 1}`}
                      style={styles.galleryImage}
                    />
                    <div style={styles.imageOverlay}>
                      <span style={styles.imageNumber}>{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyGallery}>
                <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No images uploaded yet</p>
                <span>Upload your first image above</span>
              </div>
            )}

            {user.userType === 'admin' && (
              <Link to="/admin" style={styles.adminLink}>
                <button style={styles.adminBtn}>
                  <svg style={styles.adminIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Go to Admin Dashboard
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* STATS SECTION */}
        <div style={styles.statsCard}>
          <div style={styles.statItem}>
            <svg style={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p style={styles.statLabel}>Member Since</p>
              <p style={styles.statValue}>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <svg style={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p style={styles.statLabel}>Total Images</p>
              <p style={styles.statValue}>{user.images?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
  },
  
  bgBlur1: {
    position: 'fixed',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite',
    pointerEvents: 'none',
  },
  
  bgBlur2: {
    position: 'fixed',
    bottom: '-10%',
    left: '-5%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite 1s',
    pointerEvents: 'none',
  },
  
  bgBlur3: {
    position: 'fixed',
    top: '40%',
    left: '30%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite 2s',
    pointerEvents: 'none',
  },
  
  container: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
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
    backdropFilter: 'blur(20px)',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '24px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  
  headerIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerIconSvg: {
    width: '24px',
    height: '24px',
    color: 'white',
  },
  
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  
  userName: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  welcomeSubtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  
  profileImageContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  
  profileInitial: {
    fontSize: '32px',
    fontWeight: '600',
    color: 'white',
  },
  
  uploadIcon: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    background: 'white',
    borderRadius: '50%',
    padding: '6px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },
  
  cameraIcon: {
    width: '18px',
    height: '18px',
    color: '#667eea',
  },
  
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
  },
  
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
  },
  
  logoutIcon: {
    width: '18px',
    height: '18px',
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '25px',
  },
  
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f1f5f9',
  },
  
  cardIcon: {
    width: '24px',
    height: '24px',
    color: '#667eea',
  },
  
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a2e',
    margin: 0,
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  labelIcon: {
    width: '16px',
    height: '16px',
    color: '#667eea',
  },
  
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#f8fafc',
  },
  
  roleBadge: {
    display: 'inline-block',
  },
  
  adminBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
  },
  
  userBadge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '50px',
    background: '#e2e8f0',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
  },
  
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
  
  disabledBtn: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  
  updateIcon: {
    width: '18px',
    height: '18px',
  },
  
  spinnerIcon: {
    width: '18px',
    height: '18px',
    animation: 'spin 1s linear infinite',
  },
  
  uploadSection: {
    marginBottom: '24px',
  },
  
  uploadArea: {
    border: '2px dashed #cbd5e1',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    background: '#f8fafc',
  },
  
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  
  uploadIconLarge: {
    width: '48px',
    height: '48px',
    color: '#667eea',
  },
  
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  
  uploadProgress: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '12px',
    background: '#e2e8f0',
    borderRadius: '12px',
  },
  
  spinnerSmall: {
    width: '20px',
    height: '20px',
    border: '2px solid #667eea',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
    marginTop: '20px',
  },
  
  galleryItem: {
    position: 'relative',
    aspectRatio: '1',
    overflow: 'hidden',
    borderRadius: '12px',
  },
  
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  
  imageOverlay: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  imageNumber: {
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  emptyGallery: {
    textAlign: 'center',
    padding: '40px 20px',
    background: '#f8fafc',
    borderRadius: '16px',
    marginTop: '20px',
  },
  
  emptyIcon: {
    width: '48px',
    height: '48px',
    color: '#94a3b8',
    marginBottom: '12px',
  },
  
  adminLink: {
    textDecoration: 'none',
    display: 'block',
    marginTop: '24px',
  },
  
  adminBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  adminIcon: {
    width: '18px',
    height: '18px',
  },
  
  statsCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  
  statIcon: {
    width: '32px',
    height: '32px',
    color: '#667eea',
  },
  
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '4px',
  },
  
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  
  statDivider: {
    width: '1px',
    height: '40px',
    background: '#e2e8f0',
  },
  
  hiddenInput: {
    display: 'none',
  },
};

// Add animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.3;
    }
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
  
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  }
  
  .logout-btn:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
  
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
  }
  
  .admin-btn:hover {
    background: #1976D2;
    transform: translateY(-2px);
  }
  
  .upload-area:hover {
    border-color: #667eea;
    background: #f1f5f9;
  }
  
  .gallery-image:hover {
    transform: scale(1.1);
  }
`;

document.head.appendChild(styleSheet);

export default Profile;