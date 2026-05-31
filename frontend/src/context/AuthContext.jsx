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

  const updateUser = useCallback((nextUser) => {
    setUser((currentUser) => {
      if (!nextUser) {
        return currentUser;
      }

      if (!currentUser) {
        const initialUser = { ...nextUser };

        if (initialUser.avatar && !initialUser.avatarUrl) {
          initialUser.avatarUrl = initialUser.avatar;
        }

        if (initialUser.avatarUrl && !initialUser.avatar) {
          initialUser.avatar = initialUser.avatarUrl;
        }

        if (Array.isArray(initialUser.roles)) {
          initialUser.roles = normalizeRoles(initialUser.roles);
        }

        localStorage.setItem("user", JSON.stringify(initialUser));
        return initialUser;
      }

      const mergedUser = {
        ...currentUser,
        ...nextUser,
      };

      if (mergedUser.avatar && !mergedUser.avatarUrl) {
        mergedUser.avatarUrl = mergedUser.avatar;
      }

      if (mergedUser.avatarUrl && !mergedUser.avatar) {
        mergedUser.avatar = mergedUser.avatarUrl;
      }

      if (Array.isArray(mergedUser.roles)) {
        mergedUser.roles = normalizeRoles(mergedUser.roles);
      }

      localStorage.setItem("user", JSON.stringify(mergedUser));
      return mergedUser;
    });
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
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
