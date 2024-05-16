import React, { useContext } from "react";
import styles from "./Nav.module.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth.js";

function Nav() {
  const { user, login, logout } = useContext(AuthContext);
  return (
    <div className={styles.container}>
      <div className={styles.nav_logo}>
        <Link to="/">
          <img
            src="/gentle_logo_b.png"
            className={styles.nav_logo}
            alt="logo_black"
          />
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
          <p onClick={logout} className={styles.login}>
            로그아웃
          </p>
        </div>
      ) : (
        <p onClick={login} className={styles.login}>
          로그인
        </p>
      )}
    </div>
  );
}

export default Nav;
