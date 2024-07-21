import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function fetchGeminiResponse(prompt) {
	const model = genAI.getGenerativeModel({
		model: "models/gemini-pro",
		generationConfig: {}, // Add your generation configuration here
		safetySettings: {}, // Add your safety settings here
	});

	const result = await model.generateContent(prompt);

	if (result && result.response) {
		return result.response.candidates[0]?.content.parts[0]?.text || "";
	} else {
		throw new Error("No candidates returned from the model.");
	}
}

async function saveGeminiResponseToFile() {
	const prompt = "What is the capital of Colorado?";
	const response = await fetchGeminiResponse(prompt);
	const filePath = path.join(process.cwd(), "public", "gemini-response.json");
	fs.writeFileSync(filePath, JSON.stringify({ html: response }));
}

saveGeminiResponseToFile().catch(console.error);
