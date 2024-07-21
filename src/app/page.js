// page.js
"use client";

import { useState } from "react"; // Removed useEffect

async function fetchResponse(prompt) {
	const response = await fetch("/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ prompt }),
	});

	if (!response.ok) {
		throw new Error("Failed to fetch response");
	}

	return response.json();
}

export default async function Page() {
	const [text, setText] = useState(null);
	const [error, setError] = useState(null);

	try {
		const data = await fetchResponse("What is the capital of Colorado?");
		setText(data.text);
	} catch (error) {
		setError(error.message);
	}

	if (error) return <p className="text-red-500">Error: {error}</p>;
	if (!text) return <p>Loading...</p>; // Basic loading state

	return <div>{text}</div>;
}
