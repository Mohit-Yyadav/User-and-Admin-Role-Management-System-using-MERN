import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={styles.page}>
      {/* Animated background elements */}
      <div style={styles.bgBlob1}></div>
      <div style={styles.bgBlob2}></div>
      <div style={styles.bgBlob3}></div>
      
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8" style={styles.container}>
        <div style={styles.card}>
          {/* Decorative top bar */}
          <div style={styles.topBar}></div>
          
          <div style={styles.content}>
            {/* Badge */}
            <div style={styles.badge}>
              <span style={styles.badgeIcon}>✨</span>
              <span>Full-Stack MERN Authentication</span>
            </div>

            {/* Main Title */}
            <h1 style={styles.title}>
              Modern Authentication
              <span style={styles.titleGradient}> Made Simple</span>
            </h1>
            
            <p style={styles.subtitle}>
              Secure, scalable, and beautifully crafted authentication system with 
              email verification, profile management, and admin controls.
            </p>

            {/* Feature Grid */}
            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🔐</div>
                <h3 style={styles.featureTitle}>Secure Authentication</h3>
                <p style={styles.featureText}>JWT-based auth with email verification and OTP support</p>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>👑</div>
                <h3 style={styles.featureTitle}>Admin Dashboard</h3>
                <p style={styles.featureText}>Complete user management with role-based access control</p>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🖼️</div>
                <h3 style={styles.featureTitle}>Profile Management</h3>
                <p style={styles.featureText}>Upload avatars and manage your personal information</p>
              </div>
              
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <h3 style={styles.featureTitle}>Real-time Updates</h3>
                <p style={styles.featureText}>Instant feedback with modern React hooks and context</p>
              </div>
            </div>

            {/* User Status & Actions */}
            {user ? (
              <div style={styles.userSection}>
                <div style={styles.welcomeCard}>
                  <div style={styles.avatarPlaceholder}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.userInfo}>
                    <p style={styles.welcomeText}>Welcome back,</p>
                    <p style={styles.userName}>{user.name}</p>
                    <div style={styles.userBadge}>
                      <span style={user.userType === 'admin' ? styles.adminBadge : styles.userBadgeText}>
                        {user.userType === 'admin' ? 'Administrator' : 'Member'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={styles.actionButtons}>
                  <Link to="/profile" style={{...styles.btn, ...styles.btnPrimary}}>
                    <span>👤</span> View Profile
                  </Link>
                  {user.userType === 'admin' && (
                    <Link to="/admin" style={{...styles.btn, ...styles.btnAdmin}}>
                      <span>📊</span> Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.authSection}>
                <p style={styles.ctaText}>Ready to get started?</p>
                <div style={styles.authButtons}>
                  <Link to="/login" style={{...styles.btn, ...styles.btnPrimary, ...styles.btnLarge}}>
                    Sign In
                  </Link>
                  <Link to="/register" style={{...styles.btn, ...styles.btnSecondary, ...styles.btnLarge}}>
                    Create Account
                  </Link>
                </div>
                <p style={styles.demoText}>Demo credentials: user@example.com / password123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  
  bgBlob1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  
  bgBlob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  
  bgBlob3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  
  container: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
  
  card: {
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  
  topBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  
  content: {
    padding: '48px',
  },
  
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#667eea',
    marginBottom: '24px',
  },
  
  badgeIcon: {
    fontSize: '16px',
  },
  
  title: {
    fontSize: '48px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '20px',
    color: '#1a1a2e',
  },
  
  titleGradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  subtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#666',
    marginBottom: '48px',
    maxWidth: '600px',
  },
  
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '48px',
  },
  
  featureCard: {
    padding: '24px',
    background: '#f8f9fa',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #e9ecef',
  },
  
  featureIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1a1a2e',
  },
  
  featureText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#666',
  },
  
  userSection: {
    background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
    borderRadius: '24px',
    padding: '32px',
  },
  
  welcomeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },
  
  avatarPlaceholder: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '600',
    color: 'white',
  },
  
  userInfo: {
    flex: 1,
  },
  
  welcomeText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  },
  
  userName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  
  userBadge: {
    display: 'inline-block',
  },
  
  adminBadge: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
  },
  
  userBadgeText: {
    background: '#e9ecef',
    padding: '4px 12px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#666',
  },
  
  actionButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  
  authSection: {
    textAlign: 'center',
  },
  
  ctaText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  
  authButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  
  demoText: {
    fontSize: '12px',
    color: '#999',
    marginTop: '16px',
  },
  
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '50px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
  },
  
  btnPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  
  btnSecondary: {
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
  },
  
  btnAdmin: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
  },
  
  btnLarge: {
    padding: '14px 32px',
    fontSize: '16px',
  },
  
  // Hover effects (will be applied via CSS classes in real implementation)
  '@media (max-width: 768px)': {
    content: {
      padding: '24px',
    },
    title: {
      fontSize: '32px',
    },
    featureGrid: {
      gridTemplateColumns: '1fr',
    },
  },
};

// Add hover effects (these would need to be in a separate CSS file or styled-components)
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
  }
  
  .btn-secondary:hover {
    transform: translateY(-2px);
    background: #667eea;
    color: white;
  }
  
  .main-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
  }
`;

document.head.appendChild(styleSheet);

export default Home;