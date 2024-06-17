import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Article.module.css";
import axios from "axios";
import starImage from "../../assets/images/star_y.png";

function Article({ id, title, date, cloud, analysis }) {
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
  const handleBookmarkToggle = async (
    bookmarkId,
    url,
    title,
    summary,
    date,
    cloud_image,
    analysis_image
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.post(
        "http://localhost:8000/accounts/bookmarks/",
        {
          url: url,
          title: title,
          summary: summary,
          date: date,
          cloud: cloud_image,
          analysis: analysis_image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "bookmark removed") {
        alert("Bookmark removed successfully");
        setBookmarks(
          bookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
        );
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
          onClick={handleBookmarkToggle}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className={styles.image_container} onClick={handleArticleClick}>
        <img src={`data:image/png;base64,${cloud}`} alt="cloud" />
      </div>
      <div className={styles.contents_container} onClick={handleArticleClick}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{formattedDate}</div>
        <div className={styles.leanings}>{/* {publisher}({leanings}) */}</div>
      </div>
    </div>
  );
}

export default Article;
