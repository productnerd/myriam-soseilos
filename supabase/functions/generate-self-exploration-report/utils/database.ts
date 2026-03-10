
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function fetchQuestDetails(supabaseUrl: string, supabaseServiceKey: string, questId: string) {
  console.log('🔧 Creating Supabase client...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('📖 Fetching quest details for ID:', questId);
  const { data: quest, error: questError } = await supabase
    .from('self_exploration_quests')
    .select('title, description, custom_prompt, questions')
    .eq('id', questId)
    .single();

  if (questError) {
    console.error('❌ Error fetching quest:', questError);
    throw questError;
  }

  console.log('✅ Quest details fetched:', {
    title: quest.title,
    hasDescription: !!quest.description,
    hasCustomPrompt: !!quest.custom_prompt,
    customPromptLength: quest.custom_prompt?.length || 0,
    questionsCount: Array.isArray(quest.questions) ? quest.questions.length : 0
  });

  return { supabase, quest };
}

export async function fetchUserProfile(supabase: any, userId: string) {
  console.log('👤 Fetching user profile for country info...');
  const { data: userProfile, error: userError } = await supabase
    .from('profiles')
    .select('country')
    .eq('id', userId)
    .single();

  if (userError) {
    console.log('⚠️ Could not fetch user profile:', userError.message);
  }

  console.log('✅ User profile fetched:', {
    hasCountry: !!userProfile?.country,
    country: userProfile?.country || 'Not specified'
  });

  return userProfile;
}

export async function saveResultToDatabase(supabase: any, userId: string, questId: string, aiResponse: string, customPrompt: string, questCustomPrompt: string, systemPrompt: string, responses: Record<string, any>) {
  console.log('💾 Saving result to database...');

  // Try to insert first, then update if exists
  console.log('🔄 Attempting insert...');
  const { data: insertData, error: insertError } = await supabase
    .from('self_exploration_results')
    .insert({
      user_id: userId,
      quest_id: questId,
      ai_response: aiResponse,
      prompt_used: customPrompt || questCustomPrompt || systemPrompt,
      responses_data: responses,
      version_number: 1,
      session_id: crypto.randomUUID(),
    })
    .select()
    .single();

  if (insertError) {
    console.log('⚠️ Insert failed, attempting update...', insertError.message);
    
    // If insert failed, try to update existing record
    const { data: updateData, error: updateError } = await supabase
      .from('self_exploration_results')
      .update({
        ai_response: aiResponse,
        prompt_used: customPrompt || questCustomPrompt || systemPrompt,
        responses_data: responses,
        version_number: 1,
        session_id: crypto.randomUUID(),
      })
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating result:', updateError);
      throw updateError;
    }

    console.log('✅ Result updated successfully:', {
      resultId: updateData?.id,
      hasAiResponse: !!updateData?.ai_response
    });
  } else {
    console.log('✅ Result inserted successfully:', {
      resultId: insertData?.id,
      hasAiResponse: !!insertData?.ai_response
    });
  }
}
