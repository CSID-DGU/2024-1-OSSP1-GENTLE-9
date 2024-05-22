import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/Auth.js";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log("Authorization code:", code); // 디버깅을 위한 콘솔 로그
    if (code) {
      axios
        .post("http://localhost:8000/auth/kakao/", {
          code,
        })
        .then((response) => {
          setUser(response.data.user);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error during Kakao login:", error);
          navigate("/login");
        });
    }
  }, [navigate, setUser]);

  return <div>Loading...</div>;
};

export default KakaoCallback;
