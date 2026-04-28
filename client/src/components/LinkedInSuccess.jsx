import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LinkedInSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // 🔥 store token first
      login(token);

      // small delay to allow state update
      setTimeout(() => {
        navigate("/profile");
      }, 100);
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Logging in with LinkedIn...</p>;
};

export default LinkedInSuccess;