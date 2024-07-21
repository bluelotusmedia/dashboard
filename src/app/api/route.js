// app/api/route.js
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import * as dotenv from "dotenv";
import { NextResponse } from "next/server";
import cheerio from "cheerio";
import fetch from "node-fetch";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Generation configuration (customize these as needed)
const generationConfig = {
	stopSequences: ["red"],
	maxOutputTokens: 1000,
	temperature: 0.3,
	topP: 0.1,
	topK: 16,
};

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.HARM_BLOCK_THRESHOLD_LOW,
	},
	{
		category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
		threshold: HarmBlockThreshold.HARM_BLOCK_THRESHOLD_LOW,
	},
	{
		category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
		threshold: HarmBlockThreshold.HARM_BLOCK_THRESHOLD_LOW,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.HARM_BLOCK_THRESHOLD_LOW,
	},
];
// Define the target URL to scrape here
const targetUrl = "https://finviz.com/news.ashx"; // Replace with your desired URL

async function scrapeWebsite(url) {
	const response = await fetch(url);
	const html = await response.text();
	const $ = cheerio.load(html);
	return $("table").text(); // Customize your scraping logic here
}

export async function POST(req, res) {
	try {
		const { prompt } = await req.json();

		if (!prompt) {
			return NextResponse.json(
				{ error: "Missing 'prompt' parameter" },
				{ status: 400 }
			); // Use NextResponse
		}

		// Declare model variable outside the conditional block
		const model = genAI.getGenerativeModel({
			model: "models/gemini-pro",
			generationConfig,
			safetySettings,
		});

		const scrapedContent = await scrapeWebsite(targetUrl);

		const combinedPrompt = `Summarize the key information and make investments recommendations but not advice of course. Return answer formatted as html in an unordered list with an h1 heading and h2 sub headings.\n\n${scrapedContent}\n\nGemini:`;

		const result = await model.generateContent(combinedPrompt);

		if (result && result.response) {
			const generatedHtml =
				result.response.candidates[0]?.content.parts[0]?.text || "";
			return NextResponse.json({ html: generatedHtml });
		} else {
			throw new Error("No candidates returned from the model.");
		}
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
