import styles from "./Result.module.css";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import useScrape from "../../hooks/useScrape";
import date from "../../assets/images/date.png";
import creating from "../../assets/images/creating.png";
import starFilled from "../../assets/images/star_y.png"; // 채워진 별 이미지
import starEmpty from "../../assets/images/star_g.png"; // 빈 별 이미지

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Result() {
  const query = useQuery();
  const { id } = useParams();
  const url = query.get("url"); // 쿼리 파라미터에서 url을 가져온다.
  const [article, setArticle] = useState(null);
  const { isScraped, starImage, toggleScrape, setScrapeStatus } = useScrape(
    article ? article.isscrape : 0,
    article ? article.id : null
  );
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (url) {
      console.log("URL 전송 시도:", url);
      axios
        .post(
          "http://127.0.0.1:8000/api/article/result/",
          { url: url },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("URL 전송 성공:");
          setArticle(response.data);
          setScrapeStatus(response.data.isscrape);
          setIsBookmarked(response.data.isscrape);
        })
        .catch((error) => {
          console.error("기사 가져오기 오류:", error);
          alert("URL 전송에 실패했습니다. 다시 시도해 주세요.");
        });
    } else if (id) {
      console.log("ID로 기사 가져오기 시도:", id);
      axios
        .get(`http://127.0.0.1:8000/accounts/bookmarks/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("ID로 기사 가져오기 성공:");
          setArticle(response.data);
          setScrapeStatus(response.data.isscrape);
          setIsBookmarked(true);
        })
        .catch((error) => {
          console.error("ID로 기사 가져오기 오류:", error);
          alert("기사를 가져오는 데 실패했습니다. 다시 시도해 주세요.");
        });
    }
  }, [url, id, setScrapeStatus]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:8000/accounts/bookmarks/",
        {
          url: url,
          title: article.title,
          summary: article.summary,
          date: article.date,
          cloud: article.cloud,
          analysis: article.analysis,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "bookmark removed") {
        alert("Bookmark removed successfully");
        setIsBookmarked(false);
      } else {
        alert("Bookmark added successfully");
        setIsBookmarked(true);
      }
    } catch (error) {
      setError("Failed to add bookmark.");
      console.error("Error adding bookmark:", error);
    }
  };

  if (!article && !id) {
    return (
      <div className={styles.creating_container}>
        <img src={creating} alt="creating" />
        <p>기사 생성 중...</p>
      </div>
    );
  } else if (!article && id) {
    return (
      <div className={styles.creating_container}>
        <img src={creating} alt="creating" />
        <p>Loading...</p>
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
            src={isBookmarked ? starFilled : starEmpty}
            alt="Bookmark"
            className={styles.star}
            onClick={handleBookmark}
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
            {article.cloud && (
              <img
                className={styles.image1}
                src={`data:image/png;base64,${article.cloud}`}
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
