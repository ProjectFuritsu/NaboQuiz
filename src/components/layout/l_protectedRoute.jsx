import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Initialize state by directly checking localStorage
  const [hasUser, setHasUser] = useState(() => !!localStorage.getItem("userID"));

  useEffect(() => {
    // 1. Setup a listener for storage modifications across other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "userID" && !e.newValue) {
        setHasUser(false);
      }
    };

    // 2. Setup a fast polling fallback to detect immediate deletions in the current tab
    const interval = setInterval(() => {
      const currentUserId = localStorage.getItem("userID");
      if (!currentUserId) {
        setHasUser(false);
      }
    }, 500); // Checks twice every second for maximum responsiveness

    window.addEventListener("storage", handleStorageChange);

    // Clean up event listeners and intervals on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // If no user ID is detected, immediately kick them out to the entry menu
  if (!hasUser) {
    return <Navigate to="/" replace />;
  }

  // If everything checks out, render the protected children pages (/quiz or /score)
  return <Outlet />;
}