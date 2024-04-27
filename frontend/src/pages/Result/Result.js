import styles from "./Result.module.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useArticleData from "../../hooks/useArticleData";

function Result() {
  const { id } = useParams(); // URL 파라미터에서 id를 가져옵니다.
  const article = useArticleData(id);
  const [isscrape, setIsscrape] = useState(article ? article.isscrape : 0);
  const [imageSrc, setImageSrc] = useState(
    isscrape === 0 ? "/star_g.png" : "/star_y.png"
  );
  useEffect(() => {
    if (article) {
      setIsscrape(article.isscrape);
      setImageSrc(article.isscrape === 0 ? "/star_g.png" : "/star_y.png");
    }
  }, [article]);

  const handleImageClick = () => {
    const newScrapeValue = isscrape === 1 ? 0 : 1;
    setIsscrape(newScrapeValue);
    setImageSrc(newScrapeValue === 0 ? "/star_g.png" : "/star_y.png");
  };
  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container_wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>GENTLE NEWS</p>
        </div>
        <div className={styles.middle}>
          <div className={styles.date}>
            <img src="/date.png" alt="date" />
            <p>{article.date}</p>
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
            <p className={styles.title_main}>{article.title}</p>
            <p className={styles.summary}>{article.summary}</p>
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
