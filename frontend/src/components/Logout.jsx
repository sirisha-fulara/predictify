// src/pages/Logout.jsx
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        await axios.post(`${API_URL}/auth/logout`, {}, {
          withCredentials: true
        });

        localStorage.clear();
        sessionStorage.clear();

        // Optional: show a toast/success msg
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
        navigate("/"); // still redirect
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="text-white text-center mt-10">
      Logging out...
    </div>
  );
}
