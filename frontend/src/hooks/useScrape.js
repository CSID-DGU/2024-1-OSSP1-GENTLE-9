import { useState } from "react";

function useScrape(initialScrape) {
  const [isscrape, setIsscrape] = useState(initialScrape);

  const toggleScrape = (articleId) => {
    const newScrapeValue = isscrape === 1 ? 0 : 1;
    fetch(`/api/articles/${articleId}/scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isscrape: newScrapeValue }),
    })
      .then((response) => response.json())
      .then(() => {
        setIsscrape(newScrapeValue);
      })
      .catch((error) => console.error("Error updating scrape status:", error));
  };

  return [isscrape, toggleScrape];
}

export default useScrape;
