
export function validateEnvironmentVariables() {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  console.log('🔑 Environment check:', {
    hasOpenAIKey: !!openAIApiKey,
    hasSupabaseUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    openAIKeyLength: openAIApiKey?.length || 0
  });

  if (!openAIApiKey) {
    console.error('❌ OpenAI API key not configured');
    throw new Error('OpenAI API key not configured');
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase configuration missing');
    throw new Error('Supabase configuration missing');
  }

  return { openAIApiKey, supabaseUrl, supabaseServiceKey };
}

export function validateRequestBody(requestBody: any) {
  const { questId, userId, responses, customPrompt } = requestBody;

  console.log('✅ Request body parsed:', {
    questId,
    userId,
    responsesCount: Object.keys(responses || {}).length,
    customPrompt: customPrompt ? 'Present' : 'None',
    requestBodySize: JSON.stringify(requestBody).length
  });

  if (!questId || !userId) {
    console.error('❌ Missing required parameters:', { questId, userId });
    throw new Error('Missing questId or userId');
  }

  if (!responses || Object.keys(responses).length === 0) {
    console.error('❌ No responses provided:', responses);
    throw new Error('No responses provided');
  }

  return { questId, userId, responses, customPrompt };
}
