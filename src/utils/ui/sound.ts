import { Howl } from "howler";

// Cache for preloaded sounds
const soundCache = new Map<string, Howl>();

/**
 * Play a sound file using Howler.js
 * @param src - Path to the sound file (e.g., '/sounds/correct.mp3')
 * @param volume - Volume level (0.0 to 1.0, default: 0.5)
 */
export const playSound = (src: string, volume: number = 0.5) => {
	try {
		// Check if sound is already cached
		let sound = soundCache.get(src);

		if (!sound) {
			// Create new Howl instance
			sound = new Howl({
				src: [src],
				volume: volume,
				preload: true,
				html5: false, // Use Web Audio API for better performance
			});

			// Cache the sound for reuse
			soundCache.set(src, sound);
		} else {
			// Update volume if different
			sound.volume(volume);
		}

		sound.play();
	} catch (error) {
		console.error("Error playing sound:", error);
	}
};

/**
 * Preload sounds for better performance
 * @param soundPaths - Array of sound file paths to preload
 */
export const preloadSounds = (soundPaths: string[]) => {
	soundPaths.forEach((src) => {
		if (!soundCache.has(src)) {
			const sound = new Howl({
				src: [src],
				volume: 0.5,
				preload: true,
				html5: false,
			});
			soundCache.set(src, sound);
		}
	});
};

/**
 * Stop all playing sounds
 */
export const stopAllSounds = () => {
	soundCache.forEach((sound) => {
		sound.stop();
	});
};

/**
 * Set global volume for all cached sounds
 * @param volume - Volume level (0.0 to 1.0)
 */
export const setGlobalVolume = (volume: number) => {
	soundCache.forEach((sound) => {
		sound.volume(volume);
	});
};
