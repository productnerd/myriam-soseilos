
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpdateNoteParams {
  noteId: string;
  status: string;
  comment?: string;
}

export const useUpdateCommunityNote = () => {
  const queryClient = useQueryClient();
  
  const updateNote = async ({ noteId, status, comment }: UpdateNoteParams) => {
    console.log(`Updating note ${noteId} with status: ${status}`);
    
    try {
      const updateData: Record<string, any> = { status };
      
      // Only include comment in the update if it's provided
      if (comment !== undefined) {
        updateData.comment = comment;
      }
      
      // First check if the note exists
      const { data: existingNote, error: checkError } = await supabase
        .from('community_notes')
        .select('id, status')
        .eq('id', noteId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking if community note exists:", checkError);
        throw checkError;
      }
      
      if (!existingNote) {
        console.error(`Community note with ID ${noteId} not found`);
        throw new Error(`Community note with ID ${noteId} not found`);
      }
      
      console.log("Found existing note:", existingNote);
      
      // Update the note
      const { data, error } = await supabase
        .from('community_notes')
        .update(updateData)
        .eq('id', noteId)
        .select();
        
      if (error) {
        console.error("Error updating community note:", error);
        throw error;
      }
      
      console.log("Update response data:", data);
      
      if (!data || data.length === 0) {
        console.error("No data returned from update operation");
        throw new Error("No data returned from update operation");
      }
      
      return data[0];
    } catch (error) {
      console.error("Exception in updateNote function:", error);
      throw error;
    }
  };
  
  return useMutation({
    mutationFn: updateNote,
    onSuccess: (data) => {
      console.log("Successfully updated note:", data);
      toast.success("Community note updated successfully");
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-community-notes'] });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error(`Failed to update community note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};
