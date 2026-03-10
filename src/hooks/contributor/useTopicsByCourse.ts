import { useQuery } from "@tanstack/react-query";
import { getTopicsByCourse } from "@/utils/topic/topicData";

export function useTopicsByCourse(courseId: string) {
	return useQuery({
		queryKey: ["topics", courseId],
		queryFn: () => getTopicsByCourse(courseId),
		enabled: !!courseId,
	});
}
