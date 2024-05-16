import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async () => {
    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK is not initialized.");
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj) => {
        fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${authObj.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            fetch("http://localhost:8000/kakao-login/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ access_token: authObj.access_token }),
            })
              .then((res) => res.json())
              .then((result) => {
                console.log(result);
                setUser(data);
              })
              .catch((error) => {
                console.error("Error logging in:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
          });
      },
      fail: (err) => {
        console.error("Login failed:", err);
      },
    });
  };

  const logout = () => {
    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK is not initialized.");
      return;
    }

    window.Kakao.Auth.logout(() => {
      console.log("Logged out.");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
