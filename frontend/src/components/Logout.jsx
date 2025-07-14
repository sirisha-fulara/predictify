// src/pages/Logout.jsx
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await axios.post("https://predictify-1.onrender.com/auth/logout", {}, {
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
