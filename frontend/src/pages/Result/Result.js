import styles from "./Result.module.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import useScrape from "../../hooks/useScrape";
import date from "../../assets/images/date.png";
import creating from "../../assets/images/creating.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Result() {
  const query = useQuery();
  const url = query.get("url"); // 쿼리 파라미터에서 url을 가져온다.
  const [article, setArticle] = useState(null);
  const { isScraped, starImage, toggleScrape, setScrapeStatus } = useScrape(
    article ? article.isscrape : 0,
    article ? article.id : null
  );

  useEffect(() => {
    if (url) {
      console.log("URL 전송 시도:", url);
      axios
        .post("http://127.0.0.1:8000/api/article/result/", { url: url })
        .then((response) => {
          console.log("URL 전송 성공:");
          setArticle(response.data);
          setScrapeStatus(response.data.isscrape);
        })
        .catch((error) => {
          console.error("기사 가져오기 오류:", error);
          alert("URL 전송에 실패했습니다. 다시 시도해 주세요.");
        });
    }
  }, [url, setScrapeStatus]);

  if (!article) {
    return (
      <div className={styles.creating_container}>
        <img src={creating} alt="creating" />
        <p>기사 생성 중...</p>
      </div>
    );
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
            {article.analysis_image && (
              <img
                className={styles.image1}
                src={`data:image/png;base64,${article.analysis_image}`}
                alt="analysis"
              />
            )}
            <div className={styles.title}>워드 클라우드</div>
            {article.cloud_image && (
              <img
                className={styles.image1}
                src={`data:image/png;base64,${article.cloud_image}`}
                alt="cloud"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
