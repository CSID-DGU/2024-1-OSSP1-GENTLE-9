import { useState, useEffect } from "react";

function useArticleData(id) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // /data.json에서 모든 기사 데이터를 가져옵니다.
      const response = await fetch("/data.json");
      const articles = await response.json();
      // id에 해당하는 기사를 찾아 상태를 설정합니다.
      const foundArticle = articles.find(
        (article) => article.id.toString() === id
      );
      setArticle(foundArticle);
    }

    fetchData();
  }, [id]);

  return article;
}

export default useArticleData;
