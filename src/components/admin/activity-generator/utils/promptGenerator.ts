import { ActivityType } from "@/types/activity";

// Default prompt as fallback
const DEFAULT_PROMPT = `You're an instructional designer helping operators create interactive courses (like Duolingo) to teach life skills.
Each course has topics, and each topic contains activities. The tone throughout this exercise should be informal, nurturing, kind and wise. I like it a bit snarky. As if a wise old man with a lot of knowledge and experience is talking. Make it lean towards British English and use beautiful words where appropriate.

Keep questions practical, not academic.
Consider what the user would find most useful in their day to day life to make them useful.
Use real-life examples.
For multiple choice questions, make all options plausible. Include some that seem more right than the real answer to increase difficulty of the activity.
Use concise, casual, snarky-but-not-cringe language. Tease the user a bit.`;

export const generatePrompt = (
	activityType: ActivityType,
	optionsCount: number,
	customContext: string,
	basePrompt?: string
): string => {
	const promptToUse = basePrompt || DEFAULT_PROMPT;
	let prompt = `${promptToUse}\n\n`;

	switch (activityType) {
		case "multiple_choice":
			prompt += `Create a multiple choice question with exactly ${optionsCount} options. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Your question here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswerIndex": 1,
  "optionExplanations": ["Explanation for option 1", "Explanation for option 2", "Explanation for option 3", "Explanation for option 4"],
  "explanation": "Brief overall explanation"
}`;
			break;

		case "true_false":
			prompt += `Create a true/false question. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Your statement here",
  "options": ["True", "False"],
  "correctAnswerIndex": 0,
  "optionExplanations": ["Explanation for True", "Explanation for False"],
  "explanation": "Brief explanation"
}`;
			break;

		case "text_input":
			prompt += `Create a text input question where users type a short answer. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Your question here",
  "correctAnswer": "Expected answer",
  "explanation": "Brief explanation"
}`;
			break;

		case "myth_or_reality":
			prompt += `Create a myth or reality question. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Statement to evaluate",
  "options": ["Myth", "Reality"],
  "correctAnswerIndex": 0,
  "optionExplanations": ["Explanation for Myth", "Explanation for Reality"],
  "explanation": "Brief explanation"
}`;
			break;

		case "sorting":
			prompt += `Create a sorting question with ${optionsCount} items to sort in correct order. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Sort these items: (description)",
  "options": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "correctAnswerIndex": 0,
  "optionExplanations": ["Explanation for item 1 position", "Explanation for item 2 position", "Explanation for item 3 position", "Explanation for item 4 position"],
  "explanation": "Brief explanation of correct order"
}

Note: The options array should contain the items in their CORRECT order. The system will randomize them for display.`;
			break;

		case "pair_matching":
			prompt += `Create a pair matching question with ${Math.floor(
				optionsCount / 2
			)} pairs. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Match the following pairs:",
  "options": ["Left 1", "Right 1", "Left 2", "Right 2"],
  "correctAnswerIndex": 0,
  "explanation": "Brief explanation"
}

Note: The options should be in pairs where each odd index (0,2,4...) is a left item and each even index (1,3,5...) is its matching right item. The system will randomize them for display.`;
			break;

		case "poll":
			prompt += `Create a poll question with ${optionsCount} options. Context: ${customContext}\n\n`;
			prompt += `Respond in this exact JSON format:
{
  "question": "Your poll question here",
  "options": ["Option 1", "Option 2", "Option 3"],
  "correctAnswerIndex": 0,
  "optionExplanations": ["Explanation for option 1", "Explanation for option 2", "Explanation for option 3"],
  "explanation": "This is a poll, so explanation can be about why this topic matters"
}`;
			break;
	}

	return prompt;
};
