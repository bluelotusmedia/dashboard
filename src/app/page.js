"use client";

import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

export default function ClientComponent({ initialHtml }) {
	const [htmlContent, setHtmlContent] = useState(initialHtml);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchContent() {
			try {
				const response = await fetch("/api/generate", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt: "Your updated Gemini prompt" }), // Dynamic prompt or pass as a parameter
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
		const intervalId = setInterval(fetchContent, 30000); // Update every 30 seconds

		return () => clearInterval(intervalId); // Cleanup on unmount
	}, []);

	if (loading)
		return (
			<div className="flex items-center justify-center h-screen">
				<TailSpin
					height="80"
					width="80"
					color="#4fa94d"
					ariaLabel="tail-spin-loading"
					radius="1"
					wrapperStyle={{}}
					wrapperClass=""
					visible={true}
				/>
			</div>
		);

	if (error) return <p className="text-red-500">Error: {error}</p>;

	return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
