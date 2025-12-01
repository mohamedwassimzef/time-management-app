import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

// Custom hook to use AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🟢 new loading state

  useEffect(() => {
    if (token) {
      fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false)); // 🟢 stop loading after fetch
    } else {
      setLoading(false); // 🟢 no token → loading done
    }
  }, [token]);

  const updateToken = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    updateToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, updateToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
