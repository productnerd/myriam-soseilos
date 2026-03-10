import { useNavigate } from "react-router-dom";

export function useLastVisitedTopic() {
	const navigate = useNavigate();

	// Helper function to check for and navigate to last visited topic
	const checkLastVisitedTopic = () => {
		const lastVisitedTopic = localStorage.getItem("lastVisitedTopic");
		if (lastVisitedTopic) {
			console.log("Navigating to last visited topic:", lastVisitedTopic);
			navigate(`/learn/${lastVisitedTopic}`);
			return true;
		}
		return false;
	};

	return { checkLastVisitedTopic };
}
