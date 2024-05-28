import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css"; // 필요한 경우 경로 수정
import logo_b from "../../assets/images/gentle_logo_b.png"; // 필요한 경우 경로 수정
import axios from "axios";

function Nav() {
  const [user, setUser] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Request user info with token:", token);
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        "http://localhost:8000/accounts/current_user/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request sent successfully:", response);

      if (response.status === 200) {
        const userInfo = response.data;
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    // URL에서 토큰을 확인하여 로컬 스토리지에 저장
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      console.log("토큰: ", token);
      window.history.replaceState(null, null, window.location.pathname); // URL에서 토큰 제거
    }

    // 로컬 스토리지에서 사용자 정보를 불러옴
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("stored user: ", storedUser);
      setUser(JSON.parse(storedUser));
    }

    // 사용자 정보 가져오기
    if (token || storedUser) {
      fetchUserInfo();
    }
  }, []);

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8000/accounts/kakao/login/";
  };

  const handleLogout = () => {
    // 로그아웃 로직
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // 토큰도 제거
    window.location.href = "http://localhost:3000"; // 메인 페이지로 리디렉션
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav_logo}>
        <Link to="/">
          <img src={logo_b} className={styles.nav_logo} alt="logo_black" />
        </Link>
      </div>
      <div className={styles.nav_container}>
        <Link to="/intro" style={{ textDecoration: "none", color: "black" }}>
          <p>서비스 소개</p>
        </Link>
        <Link
          to="/userguide"
          style={{ textDecoration: "none", color: "black" }}
        >
          <p>이용안내</p>
        </Link>
        <Link to="/create" style={{ textDecoration: "none", color: "black" }}>
          <p>기사생성</p>
        </Link>
        <Link to="/user" style={{ textDecoration: "none", color: "black" }}>
          <p>마이페이지</p>
        </Link>
      </div>
      {user ? (
        <div className={styles.user_info}>
          <p>안녕하세요, {user.first_name}님!</p>
          <p className={styles.login} onClick={handleLogout}>
            로그아웃
          </p>
        </div>
      ) : (
        <p onClick={handleKakaoLogin} className={styles.login}>
          로그인
        </p>
      )}
    </div>
  );
}

export default Nav;
