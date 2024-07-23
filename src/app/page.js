import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-pro";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generationConfig = {
	stopSequences: ["red"],
	maxOutputTokens: 100000,
	temperature: 1.0, // Increase temperature for more randomness
	topP: 0.95, // Increase topP to include more diverse tokens
	topK: 50, // Increase topK to consider a larger pool of tokens
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

async function fetchGeminiJoke() {
	try {
		const model = await genAI.getGenerativeModel({
			model: MODEL_NAME,
			generationConfig,
			safetySettings,
		});
		const result = await model.generateContent(
			"Tell me a joke about a programmer."
		);
		const geminiResponse = await result.response.text();
		return geminiResponse;
	} catch (err) {
		console.error("Error fetching joke:", err);
		return null;
	}
}

export default async function Home() {
	const geminiResponse = await fetchGeminiJoke();
	return (
		<main className="gemini-joke">
			<h1 className="gemini-joke__title">Gemini Pro Joke</h1>
			{!geminiResponse ? (
				<p className="gemini-joke__error">Error: Unable to fetch joke</p>
			) : (
				<p className="gemini-joke__content">{geminiResponse}</p>
			)}
		</main>
	);
}
