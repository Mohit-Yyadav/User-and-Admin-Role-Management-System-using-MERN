import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.wrapper}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>🔐</span>
            <span style={styles.logoText}>MERN<span style={styles.logoGradient}>Auth</span></span>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={styles.mobileMenuBtn}
          >
            <div style={{...styles.hamburger, transform: isMobileMenuOpen ? 'rotate(45deg)' : 'none'}} />
            <div style={{...styles.hamburgerMiddle, opacity: isMobileMenuOpen ? 0 : 1}} />
            <div style={{...styles.hamburger, transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'none', width: isMobileMenuOpen ? '24px' : '16px'}} />
          </button>

          {/* Desktop Navigation */}
          <div style={styles.desktopNav}>
            {user ? (
              <div style={styles.userSection}>
                <div style={styles.userInfo}>
                  <div style={styles.avatar}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.userDetails}>
                    <span style={styles.userName}>{user.name}</span>
                    <span style={user.userType === 'admin' ? styles.adminBadge : styles.userBadge}>
                      {user.userType === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
                
                <div style={styles.navLinks}>
                  <Link to="/profile" style={styles.navLink}>
                    <span>👤</span> Profile
                  </Link>
                  {user.userType === 'admin' && (
                    <Link to="/admin" style={{...styles.navLink, ...styles.adminLink}}>
                      <span>📊</span> Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} style={styles.logoutBtn}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.authLinks}>
                <Link to="/login" style={styles.loginLink}>
                  Sign In
                </Link>
                <Link to="/register" style={styles.registerBtn}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div style={styles.mobileNav}>
              {user ? (
                <>
                  <div style={styles.mobileUserInfo}>
                    <div style={styles.mobileAvatar}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.mobileUserName}>{user.name}</div>
                      <span style={user.userType === 'admin' ? styles.adminBadge : styles.userBadge}>
                        {user.userType === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                  <Link to="/profile" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                    <span>👤</span> Profile
                  </Link>
                  {user.userType === 'admin' && (
                    <Link to="/admin" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                      <span>📊</span> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                    <span>🚪</span> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" style={styles.mobileRegisterBtn} onClick={() => setIsMobileMenuOpen(false)}>
                    Create Account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  },
  
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
  },
  
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
    position: 'relative',
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  
  logoIcon: {
    fontSize: '28px',
  },
  
  logoText: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  logoGradient: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 12px',
    borderRadius: '50px',
    background: 'rgba(102, 126, 234, 0.1)',
  },
  
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
  },
  
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a2e',
  },
  
  adminBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  userBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '50px',
    background: '#e9ecef',
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '50px',
    textDecoration: 'none',
    color: '#4a5568',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  
  adminLink: {
    background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
    color: '#667eea',
  },
  
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '50px',
    border: 'none',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
  },
  
  authLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  
  loginLink: {
    padding: '8px 20px',
    borderRadius: '50px',
    textDecoration: 'none',
    color: '#667eea',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    border: '2px solid #667eea',
  },
  
  registerBtn: {
    padding: '8px 24px',
    borderRadius: '50px',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
  },
  
  mobileMenuBtn: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '30px',
    height: '21px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  
  hamburger: {
    width: '24px',
    height: '2px',
    background: '#1a1a2e',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  
  hamburgerMiddle: {
    width: '24px',
    height: '2px',
    background: '#1a1a2e',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  
  mobileNav: {
    position: 'absolute',
    top: '70px',
    left: 0,
    right: 0,
    background: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '12px',
    marginBottom: '8px',
  },
  
  mobileAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '20px',
  },
  
  mobileUserName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#4a5568',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    background: '#f8f9fa',
  },
  
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    background: '#ef4444',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  
  mobileRegisterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
};

// Add hover effects via style injection
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .nav-link:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
  
  .login-link:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
  
  .register-btn:hover, .logout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .mobile-nav-link:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-menu-btn {
      display: none;
    }
  }
`;

document.head.appendChild(styleSheet);

export default Navbar;