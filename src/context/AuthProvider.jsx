import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import STORAGE_KEYS from "../constants/storageKeys";
import {
  getProfile,
  logout as logoutRequest,
} from "../features/auth/services/authService";

function AuthProvider({ children }) {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

  const [user, setUser] = useState(() =>
    storedUser ? JSON.parse(storedUser) : null
  );

  // Starts true and only resolves once we've confirmed the stored token
  // (if any) is still valid — ProtectedRoute already gates on this, it
  // just never had a real async check to wait for before now.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((freshUser) => {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // Token expired, revoked, or the account no longer exists.
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    logoutRequest(); // fire-and-forget audit ping, doesn't block the UI
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;