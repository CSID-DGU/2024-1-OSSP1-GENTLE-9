import styles from "./Result.module.css";
import React, { useState, useEffect } from "react";

function Result() {
  const [imageSrc, setImageSrc] = useState("/star_g.png");
  const [contentData, setContentData] = useState({
    date: "",
    title: "",
    summary: "",
  });

  // 스크랩 별 클릭 시 호출
  const handleImageClick = () => {
    setImageSrc((currentSrc) =>
      currentSrc === "/star_g.png" ? "/star_y.png" : "/star_g.png"
    );
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/data.json");
      const data = await response.json();
      setContentData(data);
    }

    fetchData();
  }, []);
  return (
    <div className={styles.container_wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>GENTLE NEWS</p>
        </div>
        <div className={styles.middle}>
          <div className={styles.date}>
            <img src="/date.png" alt="date" />
            <p>{contentData.date}</p>
          </div>
          <img
            src={imageSrc}
            alt="star"
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        <hr />
        <div className={styles.contents}>
          <div className={styles.content_left}>
            <p className={styles.title_main}>{contentData.title}</p>
            <p className={styles.summary}>{contentData.summary}</p>
          </div>
          <div className={styles.content_right}>
            <div className={styles.title}>언론사별 성향 분석표</div>
            <img className={styles.image1} src="/result.png" alt="result" />
            <div className={styles.title}>워드 클라우드</div>
            <img className={styles.image1} src="/cloud.png" alt="cloud" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
