import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { email, userId } = location.state || {};

  useEffect(() => {
    if (!email) {
      toast.error('No email provided. Please register again.');
      navigate('/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const onSubmit = async (data) => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.verifyOTP({ email, otp: data.otp });
      toast.success('Email verified successfully! 🎉 Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    setResendLoading(true);
    try {
      await authAPI.resendOTP({ email });
      toast.success('OTP resent successfully! 📧 Check your email.');
      setCountdown(30);
      setCanResend(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(onSubmit)();
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

          {/* Icon Section */}
          <div style={styles.iconSection}>
            <div style={styles.iconWrapper}>
              <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Verify Your Email</h2>
            <p style={styles.subtitle}>
              We've sent a verification code to
            </p>
            <p style={styles.emailHighlight}>{email || 'your email address'}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <div style={styles.otpContainer}>
              <label style={styles.label}>
                Enter Verification Code
              </label>
              <div style={styles.inputWrapper}>
                <input
                  {...register('otp', { 
                    required: 'OTP is required', 
                    pattern: { 
                      value: /^\d{6}$/, 
                      message: 'OTP must be 6 digits' 
                    } 
                  })}
                  type="text"
                  style={{
                    ...styles.otpInput,
                    ...(errors.otp ? styles.inputError : styles.inputNormal),
                  }}
                  placeholder="000000"
                  maxLength="6"
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                {errors.otp && (
                  <div style={styles.inputIconError}>
                    <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.otp && <p style={styles.error}>{errors.otp.message}</p>}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.verifyButton,
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
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Account
                    <svg style={styles.buttonArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </span>
            </button>

            {/* Resend Section */}
            <div style={styles.resendSection}>
              <div style={styles.divider}>
                <div style={styles.dividerLine}></div>
                <span style={styles.dividerText}>Didn't receive code?</span>
                <div style={styles.dividerLine}></div>
              </div>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  style={{
                    ...styles.resendButton,
                    ...(resendLoading && styles.buttonDisabled),
                  }}
                  onMouseEnter={(e) => {
                    if (!resendLoading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {resendLoading ? (
                    <>
                      <svg style={styles.spinnerSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg style={styles.resendIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Resend OTP
                    </>
                  )}
                </button>
              ) : (
                <div style={styles.countdownContainer}>
                  <svg style={styles.clockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={styles.countdownText}>
                    Resend available in <strong>{countdown}</strong> seconds
                  </span>
                </div>
              )}
            </div>
          </form>

          {/* Back to Login Link */}
          <div style={styles.footer}>
            <Link to="/login" style={styles.backLink}>
              <svg style={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div style={styles.helpText}>
          <svg style={styles.helpIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Check your spam folder if you don't see the email</span>
        </div>
      </div>
    </div>
  );
};

// Add Link import
import { Link } from 'react-router-dom';

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
    pointerEvents: 'none',
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
    pointerEvents: 'none',
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
    pointerEvents: 'none',
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
    pointerEvents: 'none',
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
  
  iconSection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px',
    marginBottom: '24px',
  },
  
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
  },
  
  icon: {
    width: '40px',
    height: '40px',
    color: 'white',
  },
  
  header: {
    textAlign: 'center',
    padding: '0 32px',
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '12px',
  },
  
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
  },
  
  emailHighlight: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    marginTop: '4px',
  },
  
  form: {
    padding: '0 32px 32px 32px',
  },
  
  otpContainer: {
    marginBottom: '24px',
  },
  
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '12px',
  },
  
  inputWrapper: {
    position: 'relative',
  },
  
  otpInput: {
    width: '100%',
    padding: '16px',
    borderRadius: '16px',
    border: '2px solid',
    fontSize: '24px',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: '8px',
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
    right: '16px',
    top: '18px',
    color: '#ef4444',
  },
  
  errorIcon: {
    width: '20px',
    height: '20px',
  },
  
  error: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '8px',
    textAlign: 'center',
  },
  
  verifyButton: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '24px',
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
  
  spinnerSmall: {
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
  },
  
  resendSection: {
    marginTop: '8px',
  },
  
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
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
  
  resendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    color: '#667eea',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  
  resendIcon: {
    width: '18px',
    height: '18px',
  },
  
  countdownContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '12px',
    color: '#64748b',
    fontSize: '14px',
  },
  
  clockIcon: {
    width: '18px',
    height: '18px',
  },
  
  countdownText: {
    fontSize: '14px',
  },
  
  footer: {
    padding: '20px 32px 32px 32px',
    borderTop: '1px solid #e2e8f0',
  },
  
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  
  backIcon: {
    width: '16px',
    height: '16px',
    transition: 'transform 0.2s',
  },
  
  helpText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '20px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  
  helpIcon: {
    width: '16px',
    height: '16px',
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
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
  }
  
  .verify-button:hover:not(:disabled) .button-arrow {
    transform: translateX(4px);
  }
  
  .verify-button:hover:not(:disabled) .button-overlay {
    transform: translateX(100%);
  }
  
  .resend-button:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #667eea;
    transform: translateY(-1px);
  }
  
  .back-link:hover {
    color: #667eea;
  }
  
  .back-link:hover .back-icon {
    transform: translateX(-4px);
  }
`;

document.head.appendChild(styleSheet);

export default OTPVerification;