import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "symptoscan_auth_token";
const USER_KEY = "symptoscan_cached_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_KEY);
    try {
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper to persist auth state
  const saveAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  // Fetch current user details from backend
  const fetchMe = useCallback(async (authToken) => {
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      } else if (res.status === 401) {
        // Token expired / invalid
        saveAuth(null, null);
      }
    } catch (err) {
      console.warn("Could not reach auth server on startup:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  // LOGIN
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Invalid email or password",
        };
      }

      saveAuth(data.token, data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        error: "Unable to connect to server. Please ensure backend is running.",
      };
    }
  };

  // SIGNUP
  const signup = async ({ name, email, password, profile }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, profile }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Failed to create account",
        };
      }

      saveAuth(data.token, data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        error: "Unable to connect to server. Please try again later.",
      };
    }
  };

  // DEMO 1-CLICK LOGIN
  const demoLogin = async () => {
    const demoPayload = {
      email: "alex.clinical@symptoscan.org",
      password: "DemoPassword123!",
      name: "Dr. Alex Taylor",
      profile: {
        age: 29,
        gender: "female",
        weight: 64,
        height: 168,
        activityLevel: "moderate",
        goal: "maintain",
        bloodGroup: "O+",
        allergies: ["Penicillin", "Dust Mites"],
      },
    };

    // Try login first, if user doesn't exist, create it
    const loginAttempt = await login({
      email: demoPayload.email,
      password: demoPayload.password,
    });

    if (loginAttempt.success) {
      return loginAttempt;
    }

    // Try signup if not registered yet
    return await signup(demoPayload);
  };

  // LOGOUT
  const logout = () => {
    saveAuth(null, null);
  };

  // UPDATE PROFILE
  const updateProfile = async ({ name, profile }) => {
    if (!token) return { success: false, error: "Not authenticated" };

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, profile }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || "Update failed" };
    } catch (err) {
      // Optimistic update fallback for UI continuity
      const updatedUser = {
        ...user,
        name: name || user.name,
        profile: { ...(user.profile || {}), ...profile },
      };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
  };

  // UPDATE VITALS
  const updateVitals = async (vitals) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/vitals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vitals }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const updatedUser = { ...user, vitals: data.vitals };
          setUser(updatedUser);
          localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        }
      }
    } catch {
      // Optimistic local state update
      const updatedUser = {
        ...user,
        vitals: { ...(user?.vitals || {}), ...vitals },
      };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  // GET PREDICTION HISTORY
  const getHistory = async () => {
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE}/api/auth/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        return data.history || [];
      }
      return [];
    } catch {
      return [];
    }
  };

  // DELETE PREDICTION
  const deleteHistoryItem = async (id) => {
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/api/auth/history/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        signup,
        demoLogin,
        logout,
        updateProfile,
        updateVitals,
        getHistory,
        deleteHistoryItem,
        refreshUser: () => fetchMe(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
