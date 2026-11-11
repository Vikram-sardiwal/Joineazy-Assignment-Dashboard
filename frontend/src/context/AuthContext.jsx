import { createContext, useContext, useState } from "react";
import { users as demoUsers } from "../data/users";

const AuthContext = createContext(null);

const USERS_KEY = "joineazy_round2_users";
const SESSION_KEY = "joineazy_auth";

function getStoredUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (saved) return JSON.parse(saved);

    const initialUsers = demoUsers.map((user) => ({
      ...user,
      password: "demo123",
      role: user.role === "Admin" ? "Professor" : "Student",
    }));

    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  } catch {
    return demoUsers.map((user) => ({
      ...user,
      password: "demo123",
      role: user.role === "Admin" ? "Professor" : "Student",
    }));
  }
}

export function AuthProvider({ children }) {
  const [allUsers, setAllUsers] = useState(getStoredUsers);

  const [user, setUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY));
      if (!session?.token || !session?.user) return null;

      return session.user;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const foundUser = allUsers.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    );

    if (!foundUser) {
      return { success: false, message: "Invalid email or password." };
    }

    const { password: _, ...safeUser } = foundUser;

    const session = {
      token: `demo-token-${Date.now()}`,
      user: safeUser,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(safeUser);

    return { success: true };
  };

  const register = (name, email, password, role) => {
    const existingUser = allUsers.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (existingUser) {
      return { success: false, message: "Email is already registered." };
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };

    const updatedUsers = [...allUsers, newUser];

    setAllUsers(updatedUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    const { password: _, ...safeUser } = newUser;

    const session = {
      token: `demo-token-${Date.now()}`,
      user: safeUser,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(safeUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
