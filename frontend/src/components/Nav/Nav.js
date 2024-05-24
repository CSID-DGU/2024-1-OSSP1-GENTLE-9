import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Nav.module.css"; // 필요한 경우 경로 수정
import logo_b from "../../assets/images/gentle_logo_b.png"; // 필요한 경우 경로 수정

function Nav() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 유저 로그인 상태를 확인하는 로직을 여기에 추가합니다.
    // 예를 들어, 로컬 스토리지에서 토큰을 확인하거나 API 호출을 통해 확인할 수 있습니다.
    // setUser(로그인된 유저 정보);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 추가합니다.
    // 예를 들어, 로컬 스토리지에서 토큰을 삭제하거나 API 호출을 통해 로그아웃할 수 있습니다.
    setUser(null);
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
        <div>
          <p onClick={handleLogout} className={styles.login}>
            로그아웃
          </p>
        </div>
      ) : (
        <p onClick={handleLogin} className={styles.login}>
          로그인
        </p>
      )}
    </div>
  );
}

export default Nav;
