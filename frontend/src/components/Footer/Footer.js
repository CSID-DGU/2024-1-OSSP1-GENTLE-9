import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
import logo_w from "../../assets/images/gentle_logo_w.png";

function Footer() {
  return (
    <div className={styles.container}>
      <div>
        <img className={styles.logo} src={logo_w} alt="logo_w" />
      </div>
      <div className={styles.word_container}>
        <p>Contact: gentle@gmail.com</p>
        <p>© 2024 GENTLE. All rights reserved.</p>
      </div>
      <div className={styles.nav_container}>
        <Link to="/intro" style={{ textDecoration: "none", color: "#fff" }}>
          <p>서비스 소개</p>
        </Link>
        <Link to="/userguide" style={{ textDecoration: "none", color: "#fff" }}>
          <p>이용안내</p>
        </Link>
        <Link to="/create" style={{ textDecoration: "none", color: "#fff" }}>
          <p>기사생성</p>
        </Link>
      </div>
    </div>
  );
}

export default Footer;
