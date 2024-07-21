// app/api/route.js (or src/route.js)
import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generationConfig = {
	// ... (same as your previous generationConfig)
};

const safetySettings = [
	// ... (same as your previous safetySettings)
];

export default async function handler(req, res) {
	try {
		const { prompt } = req.body;

		if (!prompt) {
			return res.status(400).json({ error: "Missing 'prompt' parameter" });
		}

		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-pro",
			generationConfig,
			safetySettings,
		});

		const result = await model.generateContent(prompt);

		if (result) {
			const generatedHtml = result.response.candidates[0].content.parts[0].text;
			res.status(200).json({ html: generatedHtml });
		} else {
			throw new Error("No candidates returned from the model.");
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
