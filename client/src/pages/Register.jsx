import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.register(data);
      toast.success('Registration successful! Check email for OTP 🎉');
      navigate('/verify-otp', { state: { email: data.email, userId: res.data.userId } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated background elements */}
      <div style={styles.bgBlur1}></div>
      <div style={styles.bgBlur2}></div>
      <div style={styles.bgBlur3}></div>
      <div style={styles.bgBlur4}></div>

      <div style={styles.contentWrapper}>
        <div style={styles.card}>
          {/* Decorative top bar */}
          <div style={styles.topBar}></div>

          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join us and start your journey today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            {/* NAME */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Full Name
              </label>
              <div style={styles.inputWrapper}>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter your full name"
                  style={{
                    ...styles.input,
                    ...(errors.name ? styles.inputError : styles.inputNormal),
                  }}
                />
                {errors.name && (
                  <div style={styles.inputIconError}>
                    <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && <p style={styles.error}>{errors.name.message}</p>}
            </div>

            {/* EMAIL */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Address
              </label>
              <div style={styles.inputWrapper}>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : styles.inputNormal),
                  }}
                />
                {errors.email && (
                  <div style={styles.inputIconError}>
                    <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && <p style={styles.error}>{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Password
              </label>
              <div style={styles.inputWrapper}>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase, one lowercase, and one number'
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  style={{
                    ...styles.input,
                    ...(errors.password ? styles.inputError : styles.inputNormal),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? (
                    <svg style={styles.toggleIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg style={styles.toggleIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 1019.542 10c0 .55-.035 1.094-.102 1.635l-1.527-1.527a8.014 8.014 0 00.882-1.08l1.414 1.414a1 1 0 001.414-1.414l-14-14z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p style={styles.error}>{errors.password.message}</p>}
              <p style={styles.passwordHint}>Must contain uppercase, lowercase, and number</p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Confirm Password
              </label>
              <div style={styles.inputWrapper}>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  style={{
                    ...styles.input,
                    ...(errors.confirmPassword ? styles.inputError : styles.inputNormal),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  {showConfirmPassword ? (
                    <svg style={styles.toggleIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg style={styles.toggleIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 1019.542 10c0 .55-.035 1.094-.102 1.635l-1.527-1.527a8.014 8.014 0 00.882-1.08l1.414 1.414a1 1 0 001.414-1.414l-14-14z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword.message}</p>}
            </div>

            {/* USER TYPE */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Account Type
              </label>
              <select {...register('user')} style={styles.select}>
                <option value="user">👤 Regular User</option>
                <option value="admin">👑 Administrator</option>
              </select>
            </div>

            {/* TERMS AND CONDITIONS */}
            <div style={styles.termsGroup}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" required style={styles.checkbox} />
                <span style={styles.termsText}>
                  I agree to the <a href="#" style={styles.termsLink}>Terms of Service</a> and <a href="#" style={styles.termsLink}>Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 20px 35px -8px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(102, 126, 234, 0.4)';
              }}
            >
              <div style={styles.buttonOverlay}></div>
              <span style={styles.buttonText}>
                {loading ? (
                  <>
                    <svg style={styles.spinnerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Get Started
                    <svg style={styles.buttonArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>Already have an account?</span>
            <div style={styles.dividerLine}></div>
          </div>

          <Link to="/login" style={styles.loginLink}>
            Sign in instead
            <svg style={styles.loginIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  
  bgBlur1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite',
  },
  
  bgBlur2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite 1s',
  },
  
  bgBlur3: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite 2s',
  },
  
  bgBlur4: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
    width: '250px',
    height: '250px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
    borderRadius: '50%',
    animation: 'pulse 4s ease-in-out infinite 3s',
  },
  
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '480px',
  },
  
  card: {
    overflow: 'hidden',
    borderRadius: '32px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  
  topBar: {
    height: '4px',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  
  header: {
    textAlign: 'center',
    padding: '32px 32px 24px 32px',
    background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
  },
  
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    marginBottom: '16px',
  },
  
  icon: {
    width: '32px',
    height: '32px',
    color: 'white',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
  },
  
  form: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  label: {
    fontSize: '13px',
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
  
  inputWrapper: {
    position: 'relative',
  },
  
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: '#f8fafc',
    boxSizing: 'border-box',
  },
  
  inputNormal: {
    borderColor: '#e2e8f0',
  },
  
  inputError: {
    borderColor: '#ef4444',
    background: '#fef2f2',
  },
  
  inputIconError: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    color: '#ef4444',
  },
  
  errorIcon: {
    width: '18px',
    height: '18px',
  },
  
  error: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '4px',
  },
  
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#94a3b8',
    transition: 'color 0.2s',
  },
  
  toggleIcon: {
    width: '18px',
    height: '18px',
  },
  
  passwordHint: {
    fontSize: '11px',
    color: '#64748b',
    marginTop: '4px',
  },
  
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  termsGroup: {
    marginTop: '4px',
  },
  
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  
  termsText: {
    fontSize: '12px',
    color: '#64748b',
  },
  
  termsLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  },
  
  button: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
  
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  
  buttonOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.5s ease',
  },
  
  buttonText: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
  },
  
  buttonArrow: {
    width: '18px',
    height: '18px',
    transition: 'transform 0.2s',
  },
  
  spinnerIcon: {
    width: '18px',
    height: '18px',
    animation: 'spin 1s linear infinite',
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 32px 24px 32px',
  },
  
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)',
  },
  
  dividerText: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '500',
  },
  
  loginLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px 32px',
    textDecoration: 'none',
    color: '#667eea',
    fontWeight: '600',
    borderTop: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
  },
  
  loginIcon: {
    width: '16px',
    height: '16px',
    transition: 'transform 0.2s',
  },
};

// Add keyframes for animations
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
  
  input:focus, select:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
  
  .terms-link:hover {
    text-decoration: underline;
  }
  
  .login-link:hover {
    background: #f8fafc;
  }
  
  .login-link:hover .login-icon {
    transform: translateX(4px);
  }
  
  button:hover .button-arrow {
    transform: translateX(4px);
  }
  
  button:hover .button-overlay {
    transform: translateX(100%);
  }
`;

document.head.appendChild(styleSheet);

export default Register;