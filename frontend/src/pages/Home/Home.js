import React from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <p>
          <span className={styles.highlight}>GE</span>NERATE{" "}
          <span className={styles.highlight}>N</span>EU
          <span className={styles.highlight}>T</span>RA
          <span className={styles.highlight}>L</span>
          <br />N<span className={styles.highlight}>E</span>WS SERVICE
        </p>
      </div>
      <Link to="/create" style={{ textDecoration: "none", color: "black" }}>
        <div className={styles.button}>
          <p>기사 생성하기</p>
        </div>
      </Link>
    </div>
  );
}

export default Home;
