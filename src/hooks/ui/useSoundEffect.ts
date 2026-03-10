import { useCallback, useEffect } from "react";
import { playSound, preloadSounds } from "@/utils/ui/sound";

// Sound file paths
const SOUND_PATHS = {
	correct: "/sounds/correct.mp3",
	incorrect: "/sounds/incorrect.mp3",
} as const;

export function useSoundEffect() {
	// Preload sounds on hook initialization
	useEffect(() => {
		preloadSounds(Object.values(SOUND_PATHS));
	}, []);

	const playCorrectSound = useCallback(() => {
		playSound(SOUND_PATHS.correct);
	}, []);

	const playIncorrectSound = useCallback(() => {
		playSound(SOUND_PATHS.incorrect);
	}, []);

	const playSoundEffect = useCallback((isCorrect: boolean) => {
		playSound(isCorrect ? SOUND_PATHS.correct : SOUND_PATHS.incorrect);
	}, []);

	const playBackgroundSound = useCallback(
		(
			soundUrl: string,
			options: {
				loop?: boolean;
				fadeIn?: boolean;
				fadeInDuration?: number;
				maxVolume?: number;
			} = {}
		) => {
			const { loop = true, fadeIn = false, fadeInDuration = 5000, maxVolume = 1.0 } = options;

			// For background sounds, we'll still use the native Audio API
			// as Howler.js loop with fade is more complex
			const sound = new Audio(soundUrl);
			sound.loop = loop;

			if (fadeIn) {
				sound.volume = 0;
			} else {
				sound.volume = Math.min(maxVolume, 1.0);
			}

			// Handle fade-in effect
			const playWithFadeIn = () => {
				sound.play().catch((error) => {
					console.error("Error playing background sound:", error);
				});

				if (fadeIn) {
					let currentVolume = 0;
					const steps = 20;
					const increment = maxVolume / steps;
					const stepDuration = fadeInDuration / steps;

					const fadeInterval = setInterval(() => {
						currentVolume = Math.min(currentVolume + increment, maxVolume);
						sound.volume = currentVolume;

						if (currentVolume >= maxVolume) {
							clearInterval(fadeInterval);
						}
					}, stepDuration);

					return fadeInterval;
				}

				return null;
			};

			const intervalId = playWithFadeIn();

			return {
				sound,
				stop: () => {
					if (intervalId) {
						clearInterval(intervalId);
					}
					sound.pause();
					sound.currentTime = 0;
				},
				pause: () => {
					sound.pause();
				},
				resume: () => {
					sound.play().catch((error) => {
						console.error("Error resuming background sound:", error);
					});
				},
				setVolume: (volume: number) => {
					sound.volume = Math.min(Math.max(volume, 0), 1);
				},
			};
		},
		[]
	);

	return {
		playSound: playSoundEffect,
		playCorrectSound,
		playIncorrectSound,
		playBackgroundSound,
	};
}
