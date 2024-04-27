import styles from "./User.module.css";
import Article from "../../components/Article/Article.js";
import React, { useState, useEffect } from "react";

function User() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      const response = await fetch("/data.json");
      const data = await response.json();
      setArticles(data);
    }

    fetchArticles();
  }, []);
  const handleScrapeChange = (articleId, newScrapeValue) => {
    setArticles((currentArticles) => {
      // 새로운 scrape 상태로 기사를 업데이트
      return currentArticles.map((article) => {
        if (article.id === articleId) {
          return { ...article, isscrape: newScrapeValue };
        }
        return article;
      });
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content_wrapper}>
        <p className={styles.title}>마이페이지</p>
        <hr />
        <div className={styles.artical_container}>
          {articles.map((article) => (
            <Article
              key={article.id}
              {...article}
              onScrapeChange={handleScrapeChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default User;
