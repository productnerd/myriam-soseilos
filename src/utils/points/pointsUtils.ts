
import { supabase } from "@/integrations/supabase/client";
import { questEventEmitter } from "@/utils/quests/questEvaluation";

/**
 * Award grey points to a user and trigger quest evaluation
 */
export async function awardGreyPoints(userId: string, points: number, details?: string) {
  // Create transaction record
  const { data, error } = await supabase
    .from("user_transactions")
    .insert({
      user_id: userId,
      grey_points: points,
      details: details || "Grey points awarded",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating grey points transaction:", error);
    throw error;
  }

  // Update user's total grey points directly in profiles table
  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      grey_points: supabase.sql`COALESCE(grey_points, 0) + ${points}`
    })
    .eq("id", userId)
    .select("grey_points")
    .single();

  if (updateError) {
    console.error("Error updating grey points:", updateError);
    throw updateError;
  }

  const newTotal = updatedProfile?.grey_points || 0;

  // Emit quest evaluation event
  await questEventEmitter.emitGreyPointsChange(userId, newTotal);

  return data;
}

/**
 * Award dark points to a user
 */
export async function awardDarkPoints(userId: string, points: number, details?: string) {
  // Create transaction record
  const { data, error } = await supabase
    .from("user_transactions")
    .insert({
      user_id: userId,
      dark_points: points,
      details: details || "Dark points awarded",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating dark points transaction:", error);
    throw error;
  }

  // Update user's total dark points directly in profiles table
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      dark_points: supabase.sql`COALESCE(dark_points, 0) + ${points}`
    })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating dark points:", updateError);
    throw updateError;
  }

  return data;
}

/**
 * Get user's current point totals
 */
export async function getUserPoints(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("grey_points, dark_points")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user points:", error);
    throw error;
  }

  return {
    greyPoints: data?.grey_points || 0,
    darkPoints: data?.dark_points || 0,
  };
}
