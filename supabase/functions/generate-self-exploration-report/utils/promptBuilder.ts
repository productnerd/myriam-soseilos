
export function buildSystemPrompt(quest: any, userProfile: any, customPrompt: string) {
  const finalCustomPrompt = customPrompt || quest.custom_prompt || 'Provide general insights based on the responses.';
  console.log('🎯 Using prompt:', {
    hasCustomPrompt: !!customPrompt,
    hasQuestPrompt: !!quest.custom_prompt,
    finalPromptLength: finalCustomPrompt.length,
    finalPromptPreview: finalCustomPrompt.substring(0, 200)
  });

  // Build user context section
  let userContextSection = '';
  if (userProfile?.country) {
    userContextSection = `\n\nUser Context:\nCurrent Country: ${userProfile.country}`;
    console.log('🌍 Including user country context:', userProfile.country);
  }

  const systemPrompt = `You are an AI assistant that creates personalized reports based on user responses to self-exploration questions. 

Quest: ${quest.title}
Description: ${quest.description}${userContextSection}

Create a thoughtful, personalized report based on the user's responses. The report should:
- Be insightful and meaningful
- Provide actionable advice or insights
- Be encouraging and supportive
- Use markdown formatting for better readability (especially **bold** text and # headings)
- Be approximately 200-400 words
- Consider the user's cultural context if country information is provided

Custom instructions: ${finalCustomPrompt}`;

  return systemPrompt;
}

export function buildUserPrompt(responseText: string) {
  return `Based on these question-answer pairs, create a personalized report:

${responseText}

Please provide a comprehensive analysis and insights.`;
}
