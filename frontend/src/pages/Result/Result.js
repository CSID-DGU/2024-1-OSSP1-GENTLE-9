import styles from "./Result.module.css";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useArticleData from "../../hooks/useArticleData";
import useScrape from "../../hooks/useScrape";

function Result() {
  const { id } = useParams(); // URL 파라미터에서 id를 가져옵니다.
  const article = useArticleData(id);
  const { isScraped, starImage, toggleScrape } = useScrape(
    article ? article.isscrape : 0,
    id
  );

  useEffect(() => {
    if (article) {
      // article 데이터가 변경될 때마다 isScraped 상태를 업데이트합니다.
      toggleScrape(article.isscrape);
    }
  }, [article]);

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
            src={starImage}
            alt="star"
            onClick={toggleScrape}
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
            {article.analysis && (
              <img
                className={styles.image1}
                src={article.analysis}
                alt="analysis"
              />
            )}
            <div className={styles.title}>워드 클라우드</div>
            {article.cloud && (
              <img className={styles.image1} src={article.cloud} alt="cloud" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
