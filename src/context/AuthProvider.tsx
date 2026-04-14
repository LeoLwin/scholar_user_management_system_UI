import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginPayload, login as doLogin } from "@/api/authService";
import { AuthContext, LoginResult, User } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const login = async (data: LoginPayload): Promise<LoginResult> => {
    try {
      const res = await doLogin(data);
      console.log("Login response:", res);
      if (res.status === 'success') {
        const resData = res.data;
        const userData = res.data?.user;
        setUser(userData);
        setToken(resData?.token);
        localStorage.setItem("token", resData?.token);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      }
      return {
        status: res.status,
        message: res.message
      };
    } catch (error: unknown) {
      return {
        status: "error",
        message: (error as Error)?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
