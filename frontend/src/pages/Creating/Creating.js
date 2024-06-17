import React from "react";
import styles from "./Creating.module.css";
import creating from "../../assets/images/creating.png";
import FadeLoader from "react-spinners/FadeLoader";

function Creating() {
  return (
    <div className={styles.container}>
      <FadeLoader color="#000000" />
      <p className={styles.textAnimation}>기사 생성 중...</p>
    </div>
  );
}

export default Creating;
