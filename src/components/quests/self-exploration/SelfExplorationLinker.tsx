
import { useEffect } from "react";
import { linkSelfExplorationQuestsToTopics } from "@/utils/quests/self-exploration/linkSelfExplorationToTopics";

const SelfExplorationLinker = () => {
	useEffect(() => {
		// Run the linking function when component mounts
		linkSelfExplorationQuestsToTopics();
	}, []);

	return null; // This component doesn't render anything
};

export default SelfExplorationLinker;
