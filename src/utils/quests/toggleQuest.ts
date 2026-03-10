import { supabase } from "@/integrations/supabase/client";

export const toggleQuestHiddenStatus = async (questId: string, isHidden: boolean) => {
	const { data, error } = await supabase
		.from("user_sidequests")
		.update({ is_hidden: isHidden })
		.eq("id", questId)
		.select();

	if (error) throw error;
	return data;
};
