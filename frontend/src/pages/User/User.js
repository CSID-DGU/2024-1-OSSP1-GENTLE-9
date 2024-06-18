import React, { useState, useEffect } from "react";
import Article from "../../components/Article/Article";
import styles from "./User.module.css";
import axios from "axios";

function User() {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  console.log("Request user info with token:", token);

  // 사용자 저장된 기사 가져오기 함수
  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "http://localhost:8000/accounts/bookmarks/list/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookmarks(response.data);
      } catch (error) {
        setError("Failed to fetch bookmarks.");
        console.error("Error fetching bookmarks:", error);
      }
    }
    fetchBookmarks();
  }, []);

 

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content_wrapper}>
        <p className={styles.title}>마이페이지</p>
        <hr />
        <div className={styles.article_container}>
          {bookmarks.map((bookmark) => (
            <Article key={bookmark.id} {...bookmark} />
          ))}
        </div>
        <hr />
      </div>
    </div>
  );
}

export default User;
