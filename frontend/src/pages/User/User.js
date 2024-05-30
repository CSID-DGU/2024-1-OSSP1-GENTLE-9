import React, { useState, useEffect } from "react";
import Article from "../../components/Article/Article";
import styles from "./User.module.css";
import axios from "axios";

function User() {
  const [articles, setArticles] = useState([]);

  // 사용자 저장된 기사 가져오기 함수
  useEffect(() => {
    async function fetchArticles() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://localhost:8000/api/article/scrape/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // 쿠키를 포함한 요청
          }
        );

        const scrapedArticles = response.data.map((scrape) => scrape.article);
        setArticles(scrapedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }

    fetchArticles();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content_wrapper}>
        <p className={styles.title}>마이페이지</p>
        <hr />
        <div className={styles.article_container}>
          {articles.map((article) => (
            <Article key={article.id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default User;
