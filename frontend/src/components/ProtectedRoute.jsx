import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  // While restoring user state
  if (loading) return <p>Loading...</p>;

  // If no token → redirect to login
  if (!token) return <Navigate to="/login" />;

  // If authenticated → render the component
  return children;
}
