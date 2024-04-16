import React from "react";
import styles from "./UserGuide.module.css";

function UserGuide() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src="/title.png" alt="title" />
        <div className={styles.textOverImage}>How to use our service?</div>
      </div>

      <div className={styles.content_wrapper}>
        <p className={styles.title}>이용안내</p>
        <hr />

        <div className={styles.content}>
          <p className={styles.small_title}>1. 기사 링크 입력</p>
          <p className={styles.intro}>
            분석을 원하는 기사의 링크를 입력합니다.
          </p>
          <img src="/guide1.png" alt="input link" />
        </div>

        <div className={styles.content}>
          <p className={styles.small_title}>2. 결과 분석 가이드</p>
        </div>
      </div>
    </div>
  );
}

export default UserGuide;
