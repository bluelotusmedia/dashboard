"use client";

import { useEffect, useState } from "react";
import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro";

export default function Home() {
	const [geminiResponse, setGeminiResponse] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const generationConfig = {
		stopSequences: ["red"],
		maxOutputTokens: 100000,
		temperature: 0	.9,
		topP: 0.1,
		topK: 16,
	};

	const safetySettings = [
		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.BLOCK_NONE,
		},
	];

	useEffect(() => {
		async function fetchData() {
			try {
				const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
				const model = await genAI.getGenerativeModel({
					model: MODEL_NAME,
					generationConfig,
					safetySettings,
				});
				
				const result = await model.generateContent(
					"Tell me a joke about a programmer."
				);
				const response = await result.response;
				setGeminiResponse(response.text());
			} catch (error) {
				setError(error.message || "An error occurred");
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	return (
		<main className="gemini-joke">
			<h1 className="gemini-joke__title">Gemini Pro Programmer Joke</h1>
			{isLoading && <p className="gemini-joke__loader">Loading joke...</p>}
			{error && <p className="gemini-joke__error">Error: {error}</p>}
			{!isLoading && !error && (
				<p className="gemini-joke__content">{geminiResponse}</p>
			)}
		</main>
	);
}
