// app/page.js
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
	maxOutputTokens: 2000,
	temperature: 1.0,
	topP: 0.95,
	topK: 50,
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

async function fetchGeminiQuotes(retryCount = 0) {
	try {
		const model = await genAI.getGenerativeModel({
			model: MODEL_NAME,
			generationConfig,
			safetySettings,
		});
		const result = await model.generateContent(
			"Output an array of 3 json objects of sayings that are a mixture of inspirational and hilarious featuring the topics of happiness, health, wealth and wisdom. Keep them short and sweet. Give each quote object key values of 'quote' and 'author', and escape any special characters that would break json.parse(). Keep output under 2000 chars"
		);
		const geminiResponse = await result.response.text();
		const geminiResponseCleaned = geminiResponse
			.replace(/`/g, "")
			.replace(/^json\s*/, "")
			.trim();

		const quotes = JSON.parse(geminiResponseCleaned);

		if (!quotes || quotes.length === 0) {
			throw new Error("No quotes found, retrying...");
		}

		console.log(quotes);
		return quotes;
	} catch (err) {
		console.error("Error fetching quotes:", err);

		if (retryCount < 3) {
			// Maximum of 3 retries
			return fetchGeminiQuotes(retryCount + 1);
		} else {
			return null;
		}
	}
}

export default async function Home() {
	const quotes = await fetchGeminiQuotes(); // Fetch in Server Component

	return (
		<main
			className="gemini-quotes block p-4 rounded-md shadow-md bg-white max-w-screen-xl mx-auto
            dark:bg-gray-800 dark:text-white"
		>
			<h1 className="gemini-quotes__title text-xl font-light mb-4">
				Happiness, Health, Wealth, and Wisdom
			</h1>
			<h2 className="gemini-quotes__title text-md font-normal mb-4">Quotes Updated Every Two Hours by Gemini 1.5 Pro</h2>
			{quotes ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{quotes.map((item, index) => (
						<article
							key={index}
							className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900 dark:text-gray-100"
						>
							<blockquote className="gemini-quote__content prose text-white-800 dark:prose-invert">
								<p className="italic mb-2">&ldquo;{item.quote}&rdquo;</p>
								<footer className="text-right not-italic">
									— {item.author}
								</footer>
							</blockquote>
						</article>
					))}
				</div>
			) : (
				<p className="gemini-quotes__error text-red-600">
					Error fetching quotes
				</p>
			)}
		</main>
	);
}
