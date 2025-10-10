import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem("localboost_user");
    const savedSession = localStorage.getItem("localboost_session");

    if (savedUser && savedSession) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch("http://localhost:5001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      const userData = { id: data.user, email };
      setUser(userData);
      localStorage.setItem("localboost_user", JSON.stringify(userData));
      localStorage.setItem("localboost_session", data.session);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const signup = async (email, password) => {
    const response = await fetch("http://localhost:5001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      const userData = { id: data.user, email };
      setUser(userData);
      localStorage.setItem("localboost_user", JSON.stringify(userData));
      localStorage.setItem("localboost_session", data.session);
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("localboost_user");
    localStorage.removeItem("localboost_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
