import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { normalizeRoles } from "../utils/authRoles";
import AuthContext from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        const userData = res.data;
        if (userData && Array.isArray(userData.roles)) {
          userData.roles = normalizeRoles(userData.roles);
        }
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch {
        // Token invalid, clear
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const { accessToken, refreshToken, user: userData } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (userData && Array.isArray(userData.roles)) {
      userData.roles = normalizeRoles(userData.roles);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authService.register(name, email, password);
    return res;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;
    const res = await authService.refresh(refreshToken);
    const {
      accessToken,
      refreshToken: newRefreshToken,
      user: userData,
    } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    if (userData && Array.isArray(userData.roles)) {
      userData.roles = normalizeRoles(userData.roles);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
