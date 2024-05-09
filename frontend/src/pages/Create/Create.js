import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Create.module.css";

function Create() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  // URL 입력 변경 시 호출되는 함수
  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  // URL 전송 로직
  const handleSendClick = () => {
    fetch("/api/analysis", {
      //해당 페이지로 url 전송
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/creating");
        } else {
          console.error("Failed to send URL");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src="/title.png" alt="title" />
        <p className={styles.textOverImage}>요약된 기사와 분석을 제공합니다.</p>
      </div>

      <div className={styles.content_wrapper}>
        <p className={styles.title}>기사 링크 입력</p>
        <div className={styles.input_container}>
          <input
            className={styles.input}
            value={url}
            onChange={handleInputChange}
            placeholder="기사 URL 입력"
          />
          <img src="/send.png" alt="send" onClick={handleSendClick} />
        </div>
      </div>
    </div>
  );
}

export default Create;
