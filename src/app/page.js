'use client';
import { useState, useEffect } from "react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
    </div>
  );
}


export default function Page() {
  const [htmlContent, setHtmlContent] = useState("<h1>Loading...</h1>");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch("/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "Summarize the news on the page." }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }

        const data = await response.json();
        setHtmlContent(data.html);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContent(); // Initial fetch
    const intervalId = setInterval(fetchContent, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading)
    return <LoadingSpinner />;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}


