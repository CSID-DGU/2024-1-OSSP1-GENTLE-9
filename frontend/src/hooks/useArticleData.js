import { useState, useEffect } from "react";
import axios from "axios";

const useArticleData = (id) => {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/articles/${id}`
        );
        const data = response.data;

        // 이미지 데이터를 Base64로 디코딩하여 추가
        const cloudImage = data.cloud
          ? `data:image/png;base64,${data.cloud}`
          : null;
        const analysisImage = data.analysis
          ? `data:image/png;base64,${data.analysis}`
          : null;

        setArticle({
          ...data,
          cloud: cloudImage,
          analysis: analysisImage,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return article;
};

export default useArticleData;
