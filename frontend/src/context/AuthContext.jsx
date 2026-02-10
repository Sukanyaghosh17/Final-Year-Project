import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem("token");
      const storedRole = sessionStorage.getItem("role");

      if (storedToken) {
        setToken(storedToken);
        setRole(storedRole);
        try {
          // Fetch fresh user data
          const response = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            // Update session storage with fresh data
            sessionStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Token invalid or expired
            logout();
          }
        } catch (error) {
          console.error("Auth init failed", error);
          // Fallback to stored user if fetch fails (e.g. offline)
          const storedUser = sessionStorage.getItem("user");
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData, authToken, userRole) => {
    // Save to sessionStorage (clears on tab close)
    sessionStorage.setItem("token", authToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("role", userRole);

    setToken(authToken);
    setUser(userData);
    setRole(userRole);
  };

  const logout = () => {
    const currentRole = role || sessionStorage.getItem("role"); // backup if state is lost but storage exists
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setRole(null);

    if (currentRole === "citizen") {
      navigate("/citizen");
    } else if (currentRole === "police") {
      navigate("/police");
    } else {
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
