import { useRef, useCallback } from "react";

export const useScrollToBottom = () => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = useCallback(() => {
		if (scrollContainerRef.current) {
			const { scrollHeight, clientHeight } = scrollContainerRef.current;
			scrollContainerRef.current.scrollTop = scrollHeight - clientHeight;
		}
	}, []);

	return { scrollContainerRef, scrollToBottom };
};
