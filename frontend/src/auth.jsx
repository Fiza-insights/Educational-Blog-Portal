import { createContext, useContext, useState } from "react";
import { getUser, saveLogin, clearLogin } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());

  function login(token, u) {
    saveLogin(token, u);
    setUser(u);
  }

  function logout() {
    clearLogin();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
