import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const userId = localStorage.getItem("userID");

  // If no userID exists, boot them back to the home/menu page
  if (!userId) {
    return <Navigate to="/" replace />;
  }

  // If they have an ID, render the child component (the Quiz page)
  return <Outlet />;
}