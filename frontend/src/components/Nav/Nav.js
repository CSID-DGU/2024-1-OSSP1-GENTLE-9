import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Nav.module.css"; // 필요한 경우 경로 수정
import logo_b from "../../assets/images/gentle_logo_b.png"; // 필요한 경우 경로 수정
import axios from "axios";

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인을 위한 로컬 스토리지 확인
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      // 서버에서 현재 로그인된 사용자 정보를 가져옴
      axios
        .get("http://localhost:8000/accounts/current_user/")
        .then((response) => {
          const currentUser = response.data;
          localStorage.setItem("user", JSON.stringify(currentUser));
          setUser(currentUser);
        })
        .catch((error) => {
          console.log("Not logged in", error);
        });
    }
  }, []);

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8000/accounts/kakao/login/";
  };

  const handleLogout = () => {
    // 로그아웃 로직
    setUser(null);
    localStorage.removeItem("user");
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
