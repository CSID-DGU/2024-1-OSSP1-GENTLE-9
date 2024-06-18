import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Article.module.css";
import axios from "axios";
import starImage from "../../assets/images/star_y.png";

function Article({ id, url, title, summary, date, cloud, analysis }) {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);

  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleArticleClick = () => {
    navigate(`/result/${id}`);
  };

  const handleBookmarkToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:8000/accounts/bookmarks/",
        {
          url: url, // 현재 페이지 URL 사용
          title: title,
          summary: summary, // summary가 없는 경우 빈 문자열 사용
          date: date,
          cloud: cloud,
          analysis: analysis,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "bookmark removed") {
        alert("Bookmark removed successfully");
        setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
      } else {
        alert("Bookmark added successfully");
      }
    } catch (error) {
      setError("Failed to toggle bookmark.");
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <div className={styles.container} onClick={handleArticleClick}>
      <div className={styles.star_container}>
        <img
          src={starImage}
          alt="star"
          onClick={(e) => {
            e.stopPropagation();
            handleBookmarkToggle();
          }}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className={styles.image_container}>
        <img src={`data:image/png;base64,${cloud}`} alt="cloud" />
      </div>
      <div className={styles.contents_container}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{formattedDate}</div>
        <div className={styles.leanings}>{/* {publisher}({leanings}) */}</div>
      </div>
    </div>
  );
}

export default Article;
