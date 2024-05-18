import React, { useState, useEffect } from "react";
import Article from "../../components/Article/Article";
import styles from "./User.module.css";

function User() {
  // 백 연결 코드
  // const [articles, setArticles] = useState([]);

  // useEffect(() => {
  //   async function fetchArticles() {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/articles/"); //api 주소
  //       setArticles(response.data);
  //     } catch (error) {
  //       console.error("Error fetching articles:", error);
  //     }
  //   }

  //   fetchArticles();
  // }, []);

  // const handleScrapeChange = async (articleId, newScrapeValue) => {
  //   setArticles((currentArticles) => {
  //     return currentArticles.map((article) => {
  //       if (article.id === articleId) {
  //         return { ...article, isscrape: newScrapeValue };
  //       }
  //       return article;
  //     });
  //   });

  //   try {
  //     if (newScrapeValue === 1) {
  //       await axios.post(`http://localhost:8000/api/scrape/`, { articleId });
  //     } else {
  //       await axios.delete(`http://localhost:8000/api/scrape/${articleId}/`);
  //     }
  //   } catch (error) {
  //     console.error("Error updating scrape status:", error);
  //   }
  // };


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
