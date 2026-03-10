
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Increment the user's streak when they reach daily goals
 * Used for both main learning flow (20 activities) and review completion
 */
export async function incrementUserStreak(
  userId: string, 
  reason: 'daily_activity_goal' | 'review_completion'
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const transactionDetails = reason === 'daily_activity_goal' 
      ? 'Streak increased: daily activity goal reached'
      : 'Streak increased: review session completed';
    
    // Check if streak already updated today for this reason
    const { data: transactions, error: transactionError } = await supabase
      .from('user_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('details', transactionDetails)
      .gte('created_at', new Date(new Date().setHours(0,0,0,0)).toISOString())
      .lt('created_at', new Date(new Date().setHours(23,59,59,999)).toISOString())
      .limit(1);
      
    if (transactionError) {
      console.error('Error checking for existing streak transaction:', transactionError);
      return;
    }
    
    if (transactions && transactions.length > 0) {
      console.info(`Streak already updated today for ${reason}`);
      return;
    }
    
    // Get current streak and increment it
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('streak')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error getting current streak:', profileError);
      return;
    }
    
    const currentStreak = profileData?.streak || 0;
    const newStreak = currentStreak + 1;
    
    console.info(`Updating streak from ${currentStreak} to ${newStreak} (${reason})`);
    
    // Update the streak
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (updateError) {
      console.error('Error updating streak:', updateError);
      return;
    }
    
    // Record transaction
    const { error: transactionInsertError } = await supabase
      .from('user_transactions')
      .insert({
        user_id: userId,
        details: transactionDetails
      });
      
    if (transactionInsertError) {
      console.error('Error recording streak transaction:', transactionInsertError);
    } else {
      toast.success('Streak increased! 🔥', {
        description: `You've maintained your streak for ${newStreak} day${newStreak !== 1 ? 's' : ''}!`,
      });
      console.log(`Streak updated and transaction recorded (${reason})`);
    }
  } catch (error) {
    console.error('Error incrementing streak:', error);
  }
}
