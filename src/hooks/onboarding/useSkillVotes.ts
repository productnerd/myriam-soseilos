import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SkillStat } from "@/components/onboarding/SkillVoteStats";
import { useToast } from "@/hooks/ui/useToast";

// Type for the RPC function response
interface TopSkillsResponse {
	skill_name: string;
	vote_count: number;
}

export function useSkillVotes(userId: string) {
	const [loading, setLoading] = useState<boolean>(false);
	const [topSkills, setTopSkills] = useState<SkillStat[]>([]);
	const { toast } = useToast();

	const submitSkillVotes = async (skills: string[]) => {
		setLoading(true);
		try {
			const { error } = await supabase.from("onboarding_skill_votes").insert({
				user_id: userId,
				skills: skills,
			});

			if (error) throw error;

			toast({
				title: "Thank you!",
				description: "Your interests have been recorded",
			});

			return true;
		} catch (error) {
			console.error("Error submitting skill votes:", error);
			toast({
				title: "Error",
				description: "Failed to submit your interests. Please try again.",
				variant: "destructive",
			});
			return false;
		} finally {
			setLoading(false);
		}
	};

	const fetchTopSkills = async () => {
		setLoading(true);
		try {
			// Use the new centralized function to get top 8 skills
			const { data, error } = (await supabase.rpc("get_top_skills", { limit_count: 8 })) as {
				data: TopSkillsResponse[] | null;
				error: any;
			};

			if (error) throw error;

			if (data && Array.isArray(data) && data.length > 0) {
				// Convert to SkillStat format
				const skillStats: SkillStat[] = data.map((item) => ({
					skill: item.skill_name,
					percentage: item.vote_count, // Using percentage field to store the actual vote count
				}));

				setTopSkills(skillStats);
			} else {
				// If no votes exist yet, show placeholder message but don't show empty stats
				setTopSkills([]);
			}
		} catch (error) {
			console.error("Error fetching top skills:", error);
			// On error, show empty but don't break the UI
			setTopSkills([]);
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		topSkills,
		submitSkillVotes,
		fetchTopSkills,
	};
}
