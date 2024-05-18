import styles from "./Result.module.css";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import useArticleData from "../../hooks/useArticleData";
import useScrape from "../../hooks/useScrape";
import date from "../../assets/images/date.png";
// import star_y from "../../assets/images/star_y.png";
// import star_g from "../../assets/images/star_g.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Result() {
  const { id } = useParams(); // URL 파라미터에서 id를 가져온다.
  const query = useQuery();
  const url = query.get("url"); // 쿼리 파라미터에서 url을 가져온다.
  const articleFromDB = useArticleData(id);
  const [article, setArticle] = useState(null);
  const { isScraped, starImage, toggleScrape, setScrapeStatus } = useScrape(
    article ? article.isscrape : 0,
    id
  );

  useEffect(() => {
    if (url) {
      // URL 분석 요청 처리
      fetch(`/api/result/?url=${encodeURIComponent(url)}`)
        .then((response) => response.json())
        .then((data) => {
          setArticle(data);
          setScrapeStatus(data.isscrape);
        })
        .catch((error) => console.error("Error fetching article:", error));
    } else if (id) {
      // DB 요청 처리
      if (articleFromDB) {
        setArticle(articleFromDB);
        setScrapeStatus(articleFromDB.isscrape);
      }
    }
  }, [id, url, articleFromDB, setScrapeStatus]);

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
            <img src={date} alt="date" />
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
