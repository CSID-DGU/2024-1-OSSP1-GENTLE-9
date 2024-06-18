import styles from "./Result.module.css";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import date from "../../assets/images/date.png";
import starFilled from "../../assets/images/star_y.png"; // 채워진 별 이미지
import starEmpty from "../../assets/images/star_g.png"; // 빈 별 이미지
import FadeLoader from "react-spinners/FadeLoader";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Result() {
  const query = useQuery();
  const { id } = useParams();
  const url = query.get("url"); // 쿼리 파라미터에서 url을 가져온다.
  const [article, setArticle] = useState(null);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (url) {
      console.log("URL 전송 시도:", url);
      axios
        .post("http://127.0.0.1:8000/api/article/result/", { url: url })
        .then((response) => {
          console.log("URL 전송 성공:");
          setArticle(response.data);
          console.log(response.data);
          setIsBookmarked(false);
        })
        .catch((error) => {
          console.error("기사 가져오기 오류:", error);
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
          setIsBookmarked(true);
        })
        .catch((error) => {
          console.error("ID로 기사 가져오기 오류:", error);
          alert("기사를 가져오는 데 실패했습니다. 다시 시도해 주세요.");
        });
    }
  }, [url, id]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const requestData = {
        url: article.url,
        title: article.title,
        summary: article.summary,
        date: article.date,
        cloud: article.cloud,
        analysis: article.analysis,
      };

      console.log("Request data:", requestData);

      const response = await axios.post(
        "http://localhost:8000/accounts/bookmarks/",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Server response:", response.data);

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
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  if (!article && !id) {
    return (
      <div className={styles.creating_container}>
        <FadeLoader color="#000000" />
        <p>기사 생성 중...</p>
      </div>
    );
  } else if (!article && id) {
    return (
      <div className={styles.creating_container}>
        <FadeLoader color="#000000" />
        <p>Loading...</p>
      </div>
    );
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  return (
    <div className={styles.container_wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>GENTLE NEWS</p>
        </div>
        <div className={styles.middle}>
          <div className={styles.date}>
            <img src={date} alt="date" />
            <p>{formatDate(article.date)}</p>
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
            {article.analysis && (
              <img
                className={styles.image2}
                src={`data:image/png;base64,${article.analysis}`}
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
