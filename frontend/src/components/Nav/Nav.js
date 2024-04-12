import React from "react";
import styles from "./Nav.module.css";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className={styles.container}>
      <div className={styles.nav_logo}>
        <Link to="/">
          <img
            src="gentle_logo_b.png"
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
      </div>
    </div>
  );
}

export default Nav;
