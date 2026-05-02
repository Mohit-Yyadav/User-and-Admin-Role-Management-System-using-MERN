import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLinkedInLogin = () => {
    window.location.href = import.meta.env.VITE_LINKEDIN_AUTH_URL;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authAPI.login(data);
      login(res.data.token, res.data.user);
      toast.success("Login successful! Welcome back! 🎉");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated background elements */}
      <div style={styles.bgBlur1}></div>
      <div style={styles.bgBlur2}></div>
      <div style={styles.bgBlur3}></div>
      <div style={styles.bgBlur4}></div>

      <div style={styles.contentWrapper}>
        {/* Main card */}
        <div style={styles.card}>
          {/* Header with gradient */}
          <div style={styles.header}>
            <div style={styles.headerDecor1}></div>
            <div style={styles.headerDecor2}></div>
            <div style={styles.headerContent}>
              <div style={styles.iconWrapper}>
                <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p style={styles.welcomeBadge}>Welcome back</p>
              <h2 style={styles.title}>Sign In</h2>
              <p style={styles.subtitle}>Access your account securely</p>
            </div>
          </div>

          {/* Form container */}
          <div style={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
              {/* Email field */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  Email Address
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    type="email"
                    style={{
                      ...styles.input,
                      ...(errors.email ? styles.inputError : styles.inputNormal),
                    }}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <div style={styles.inputIconError}>
                      <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p style={styles.errorMessage}>
                    <svg style={styles.errorMessageIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  <svg style={styles.labelIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                  Password
                </label>
                <div style={styles.inputWrapper}>
                  <input
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    style={{
                      ...styles.input,
                      ...(errors.password ? styles.inputError : styles.inputNormal),
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? (
                      <svg style={styles.toggleIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      <svg style={styles.toggleIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 1019.542 10c0 .55-.035 1.094-.102 1.635l-1.527-1.527a8.014 8.014 0 00.882-1.08l1.414 1.414a1 1 0 001.414-1.414l-14-14z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p style={styles.errorMessage}>
                    <svg style={styles.errorMessageIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot password link */}
              <div style={styles.forgotPasswordWrapper}>
                <Link to="/forgot-password" style={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.submitButtonDisabled),
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 20px 35px -8px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.4)';
                }}
              >
                <div style={styles.submitButtonOverlay}></div>
                <span style={styles.submitButtonText}>
                  {loading ? (
                    <>
                      <svg style={styles.spinnerIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg style={styles.submitArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or continue with</span>
              <div style={styles.dividerLine}></div>
            </div>

            {/* Social Login Buttons */}
            <div style={styles.socialButtons}>
              <button
                onClick={handleLinkedInLogin}
                style={styles.linkedinButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.background = '#0A66C2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = '#0077B5';
                }}
              >
                <svg style={styles.linkedinIcon} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C0.792 0 0 0.774 0 1.729v20.542C0 23.227 0.792 24 1.771 24h20.451c0.979 0 1.771-0.773 1.771-1.729V1.729C24 0.774 23.206 0 22.225 0z"/>
                </svg>
                Continue with LinkedIn
              </button>
            </div>

            {/* Sign up link */}
            <p style={styles.signupText}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.signupLink}>
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div style={styles.securityBadge}>
          <svg style={styles.securityIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A10.03 10.03 0 0010 2c1.9 0 3.655.537 5.166 1.439A9.969 9.969 0 0010 10a.5.5 0 00.02.398c-.042.154-.051.336 0 .5a.5.5 0 00.24.3c.402.25.85.43 1.33.52A9.97 9.97 0 0010 20c-5.523 0-10-4.477-10-10 0-5.523 4.477-10 10-10 2.1 0 4.024.632 5.5 1.727-2.5.2-4.5 1.6-5.5 3.272a.5.5 0 00-.098-.037 5 5 0 00-1.236-.149 4 4 0 00-1.2.186l-.002.007h-.002C4.952 5.83 3.5 7.33 3.5 9.5a5 5 0 002.5 4.5c.5.3 1 .5 1.5.5.5 0 1-.2 1.5-.5-.5-1-1-2-1-3 0-1 .5-2 1-2.5.5-.5 1-1 1.5-1.5.5-.5 1-1 1.5-1 1.5.5 2.5 2 2.5 4 0 .5 0 1-.2 1.5-1.2.3-2.3 1-3 2 0 0-.7 1.3-.3 2.5.6 1.3 1.4 2 1.9 2.5.5.5 1 .5 1.5.5s1-.2 1.5-.5c.5-.5 1-1 1.5-1.5.5-.5 1-1 1-1.5.5.5.8 1.2 1 2.7.3.5.6 1.2.9 1.4.3.2.6.1.8-.1.2-.2.3-.5.1-.8-.2-.3-.5-.7-.8-1.2-.1-.2-.2-.5-.3-.7.4-.6.7-1.3.9-2 .2-.6.3-1.3.3-2 0-3.5-2.5-5-4.5-6.5-1.5-1-2.5-2-2.5-3.5 0-1.5 1-2.5 1.5-3.5.5-1 .5-1.5.5-2zM9 18c-1 0-2-.5-2.5-1.5.5.5 1 .5 1.5.5s1-.2 1.5-.5c0 0 .2-.1.5-.1.5 0 1 .2 1.5.5-.5 1-1.5 1-2.5 1z"/>
          </svg>
          <span>Your login is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
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
    maxWidth: '448px',
  },
  
  card: {
    overflow: 'hidden',
    borderRadius: '32px',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  
  header: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '32px',
    paddingBottom: '48px',
  },
  
  headerDecor1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '160px',
    height: '160px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    marginRight: '-80px',
    marginTop: '-80px',
  },
  
  headerDecor2: {
    position: 'absolute',
    bottom: '-40px',
    left: '-40px',
    width: '120px',
    height: '120px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '50%',
  },
  
  headerContent: {
    position: 'relative',
  },
  
  iconWrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    marginBottom: '16px',
  },
  
  icon: {
    width: '24px',
    height: '24px',
    color: 'white',
  },
  
  welcomeBadge: {
    fontSize: '12px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginBottom: '8px',
  },
  
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
  },
  
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
  },
  
  formContainer: {
    padding: '32px',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  
  fieldGroup: {
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
    width: '18px',
    height: '18px',
    color: '#667eea',
  },
  
  inputWrapper: {
    position: 'relative',
  },
  
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '16px',
    border: '2px solid',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)',
  },
  
  inputNormal: {
    borderColor: '#e2e8f0',
  },
  
  inputError: {
    borderColor: '#ef4444',
    background: 'rgba(254, 226, 226, 0.3)',
  },
  
  inputIconError: {
    position: 'absolute',
    right: '12px',
    top: '14px',
    color: '#ef4444',
  },
  
  errorIcon: {
    width: '18px',
    height: '18px',
  },
  
  errorMessage: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
  },
  
  errorMessageIcon: {
    width: '14px',
    height: '14px',
  },
  
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '14px',
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
  
  forgotPasswordWrapper: {
    textAlign: 'right',
    marginTop: '-8px',
  },
  
  forgotPassword: {
    fontSize: '13px',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  
  submitButton: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '14px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.4)',
  },
  
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  
  submitButtonOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.5s ease',
  },
  
  submitButtonText: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  
  submitArrow: {
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
    marginTop: '24px',
    marginBottom: '24px',
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
  
  socialButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  
  linkedinButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    borderRadius: '24px',
    background: '#0077B5',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 119, 181, 0.3)',
  },
  
  linkedinIcon: {
    width: '20px',
    height: '20px',
  },
  
  signupText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
    marginTop: '24px',
  },
  
  signupLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s',
  },
  
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '24px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.9)',
  },
  
  securityIcon: {
    width: '18px',
    height: '18px',
    color: '#10b981',
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
  
  .forgot-password:hover {
    color: #764ba2;
  }
  
  .signup-link:hover {
    color: #764ba2;
  }
  
  .submit-button:hover .submit-arrow {
    transform: translateX(4px);
  }
  
  .submit-button:hover .submit-button-overlay {
    transform: translateX(100%);
  }
  
  input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

document.head.appendChild(styleSheet);

export default Login;