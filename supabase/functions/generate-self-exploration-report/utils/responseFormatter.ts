
export function formatResponsesWithQuestions(quest: any, responses: Record<string, any>) {
  console.log('📝 Formatting responses with questions...');
  const questions = Array.isArray(quest.questions) ? quest.questions : [];
  const responseEntries = Object.entries(responses);
  
  console.log('📊 Response processing:', {
    questionsAvailable: questions.length,
    responseEntries: responseEntries.length,
    questionsStructure: questions.map((q, i) => ({
      index: i,
      type: q?.type,
      hasQuestion: !!q?.question,
      questionPreview: q?.question?.substring(0, 50)
    }))
  });
  
  let responseText = '';
  
  if (questions.length > 0) {
    // Format with question-answer pairs
    responseText = responseEntries
      .map(([questionIndex, answer]) => {
        const index = parseInt(questionIndex);
        const question = questions[index];
        const questionText = question?.question || `Question ${index + 1}`;
        
        console.log(`📝 Q&A ${index + 1}: ${questionText.substring(0, 50)}... -> ${String(answer).substring(0, 30)}...`);
        
        return `Question ${index + 1}: ${questionText}\nAnswer: ${answer}`;
      })
      .join('\n\n');
  } else {
    // Fallback to just answers if no questions available
    console.log('⚠️ No questions found in quest, using answer-only format');
    responseText = responseEntries
      .map(([questionIndex, answer]) => {
        console.log(`📝 Response ${parseInt(questionIndex) + 1}: ${String(answer).substring(0, 50)}...`);
        return `Response ${parseInt(questionIndex) + 1}: ${answer}`;
      })
      .join('\n\n');
  }

  console.log('✅ Formatted responses length:', responseText.length);
  return responseText;
}
