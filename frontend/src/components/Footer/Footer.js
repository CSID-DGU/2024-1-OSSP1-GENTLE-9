import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={styles.container}>
      <div>
        <img className={styles.logo} src="gentle_logo_w.png" alt="logo_w" />
      </div>
      <div className={styles.word_container}>
        <p>Contact: gentle@gmail.com</p>
        <p>© 2024 GENTLE. All rights reserved.</p>
      </div>
      <div className={styles.nav_container}>
        <p>서비스 소개</p>
        <p>이용안내</p>
        <p>기사생성</p>
      </div>
    </div>
  );
}

export default Footer;
