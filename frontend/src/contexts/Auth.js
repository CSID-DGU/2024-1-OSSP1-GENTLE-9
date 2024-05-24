import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
    }

    window.Kakao.Auth.login({
      success: (authObj) => {
        axios
          .post("http://localhost:8000/auth/kakao/", {
            access_token: authObj.access_token,
          })
          .then((response) => {
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
          })
          .catch((error) => {
            console.error("Login failed", error);
          });
      },
      fail: (err) => {
        console.error("Login failed", err);
      },
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    if (window.Kakao.Auth.getAccessToken()) {
      window.Kakao.Auth.logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
