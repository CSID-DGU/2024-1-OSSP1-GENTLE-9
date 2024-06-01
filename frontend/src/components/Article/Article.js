import React from "react";
import { useNavigate } from "react-router-dom";
import useScrape from "../../hooks/useScrape"; // 훅을 import 합니다.
import styles from "./Article.module.css";


function Article({
  id,
  title,
  date,
  publisher,
  leanings,
  isscrape,
  onScrapeChange,
}) {
  const { isScraped, starImage, toggleScrape } = useScrape(isscrape, id); // 훅을 사용합니다.
  const navigate = useNavigate();

  const handleImageClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    toggleScrape();
    onScrapeChange(id, isScraped ? 0 : 1); // 스크랩 상태 변경
  };

  const handleArticleClick = () => {
    navigate(`/result/${id}`);
  };

  return (
    <div className={styles.container} onClick={handleArticleClick}>
      <div className={styles.star_container}>
        <img
          src={starImage}
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
