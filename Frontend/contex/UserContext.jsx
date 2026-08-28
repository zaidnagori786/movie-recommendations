import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // ✅ LOGIN (THIS IS MISSING)
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData); // 🔥 triggers navbar update
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Your existing function (kept)
  const handleChangePlan = (newPlan) => {
    const today = new Date().toISOString();
    setUser((prev) => ({
      ...prev,
      subscription: newPlan,
      subscriptionDate: today,
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, handleChangePlan }}
    >
      {children}
    </UserContext.Provider>
  );
};
