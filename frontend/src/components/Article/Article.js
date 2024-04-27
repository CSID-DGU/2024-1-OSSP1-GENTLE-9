import styles from "./Article.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Article({
  id,
  title,
  date,
  publisher,
  leanings,
  isscrape,
  onScrapeChange,
}) {
  const [isScraped, setIsScraped] = useState(isscrape);
  const navigate = useNavigate();

  const handleImageClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    const newScrapeValue = isScraped === 1 ? 0 : 1;
    setIsScraped(newScrapeValue);
    onScrapeChange(id, newScrapeValue); // 상위 컴포넌트의 핸들러 호출
    // 서버 업데이트 로직 추가 (API 호출 등)
  };

  const handleArticleClick = () => {
    navigate(`/result/${id}`);
  };

  const imageSrc = isScraped === 0 ? "/star_g.png" : "/star_y.png";

  return (
    <div className={styles.container} onClick={handleArticleClick}>
      <div className={styles.star_container}>
        <img
          src={imageSrc}
          alt="star"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className={styles.image_container}>
        <img src="/cloud.png" alt="cloud" />
      </div>
      <div className={styles.contents_container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{date}</div>
        <div className={styles.leanings}>
          {publisher}({leanings})
        </div>
      </div>
    </div>
  );
}

export default Article;
