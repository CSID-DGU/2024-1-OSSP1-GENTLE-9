import React from "react";
import styles from "./Create.module.css";

function Create() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src="/title.png" alt="title" />
        <p className={styles.textOverImage}>요약된 기사와 분석을 제공합니다.</p>
      </div>

      <div className={styles.content_wrapper}>
        <p className={styles.title}>기사 링크 입력</p>
        <div className={styles.input_container}>
          <input
            className={styles.input}
            defaultValue="https://news.gentle.co.kr/news/article"
          />
          <img src="/send.png" alt="send" />
        </div>
      </div>
    </div>
  );
}

export default Create;
