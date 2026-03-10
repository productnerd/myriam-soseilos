
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { validateEnvironmentVariables, validateRequestBody } from './utils/validation.ts';
import { fetchQuestDetails, fetchUserProfile, saveResultToDatabase } from './utils/database.ts';
import { formatResponsesWithQuestions } from './utils/responseFormatter.ts';
import { buildSystemPrompt, buildUserPrompt } from './utils/promptBuilder.ts';
import { callOpenAI } from './utils/openaiClient.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 === Edge function started ===');
  console.log('📝 Request method:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('⚙️ Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();

    // Validate environment variables
    const { openAIApiKey, supabaseUrl, supabaseServiceKey } = validateEnvironmentVariables();

    // Parse and validate request body
    console.log('📥 Parsing request body...');
    const requestBody = await req.json();
    const { questId, userId, responses, customPrompt } = validateRequestBody(requestBody);

    // Fetch quest details and create Supabase client
    const { supabase, quest } = await fetchQuestDetails(supabaseUrl, supabaseServiceKey, questId);

    // Fetch user profile for country information
    const userProfile = await fetchUserProfile(supabase, userId);

    // Format responses with questions for better AI context
    const responseText = formatResponsesWithQuestions(quest, responses);

    // Build prompts
    const systemPrompt = buildSystemPrompt(quest, userProfile, customPrompt);
    const userPrompt = buildUserPrompt(responseText);

    // Call OpenAI API
    const { aiResponse, openAICallTime } = await callOpenAI(openAIApiKey, systemPrompt, userPrompt, userProfile);

    // Save result to database
    await saveResultToDatabase(supabase, userId, questId, aiResponse, customPrompt, quest.custom_prompt, systemPrompt, responses);

    console.log('🎉 === Edge function completed successfully ===');
    return new Response(JSON.stringify({ 
      success: true, 
      aiResponse,
      metadata: {
        responseLength: aiResponse.length,
        processingTime: Date.now() - startTime,
        openAICallTime,
        questTitle: quest.title,
        includedUserCountry: !!userProfile?.country,
        questionsIncluded: Array.isArray(quest.questions) ? quest.questions.length > 0 : false
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 === Error in generate-self-exploration-report ===');
    console.error('❌ Error name:', error?.name);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Full error object:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error?.message || 'Unknown error occurred',
      details: {
        name: error?.name,
        stack: error?.stack?.substring(0, 500)
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
