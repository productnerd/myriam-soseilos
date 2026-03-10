import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
	timeRemaining: number;
	onTimeout: () => void;
	isActive: boolean; // Used to stop the timer when the user completes the activity
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
	timeRemaining,
	onTimeout = () => {},
	isActive = true,
}) => {
	const [time, setTime] = useState(timeRemaining);

	useEffect(() => {
		setTime(timeRemaining);
	}, [timeRemaining]);

	useEffect(() => {
		if (!isActive || time <= 0) return;

		const timer = setInterval(() => {
			setTime((prevTime) => {
				if (prevTime <= 1) {
					onTimeout();
					return 0;
				}
				return prevTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [isActive, onTimeout, time]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return <div className="text-lg font-mono">{formatTime(time)}</div>;
};

export default CountdownTimer;
