import { useState } from "react";
import AuthContext from "./AuthContext";
import STORAGE_KEYS from "../constants/storageKeys";

function AuthProvider({ children }) {
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

  const [user, setUser] = useState(() =>
    storedUser ? JSON.parse(storedUser) : null
  );

  const loading = false;

  const login = (userData) => {
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
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