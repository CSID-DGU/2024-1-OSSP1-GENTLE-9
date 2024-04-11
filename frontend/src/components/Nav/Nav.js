import React from "react";
import styles from "./Nav.module.css";

function Nav() {
  return (
    <div className={styles.container}>
      <div className={styles.nav_logo}>
        <img
          src="gentle_logo_b.png"
          className={styles.nav_logo}
          alt="logo_black"
        />
      </div>
      <div className={styles.nav_container}>
        <p>서비스 소개</p>
        <p>이용 안내</p>
        <p>기사 생성</p>
      </div>
    </div>
  );
}

export default Nav;
