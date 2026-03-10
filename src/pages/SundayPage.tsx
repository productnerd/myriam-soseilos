import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/ui/PageTransition";
import MentorPopup from "@/components/ui/MentorPopup";
import { useSundayCheck } from "@/hooks/activity/useSundayCheck";
import { useSoundEffect } from "@/hooks/ui/useSoundEffect";
import Logo from "@/components/ui/Logo";

const SundayPage = () => {
	const [showMentor, setShowMentor] = useState(false);
	const navigate = useNavigate();
	const { isSunday } = useSundayCheck();
	const { playBackgroundSound } = useSoundEffect();
	const audioControlRef = useRef<ReturnType<typeof playBackgroundSound> | null>(null);

	// Redirect if it's not Sunday
	useEffect(() => {
		if (!isSunday) {
			navigate("/learn", { replace: true });
		}
	}, [isSunday, navigate]);

	// Add a slight delay before showing the mentor for better UX
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMentor(true);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	// Background forest sounds with fade-in effect
	useEffect(() => {
		if (isSunday) {
			audioControlRef.current = playBackgroundSound(
				"https://www.dropbox.com/scl/fi/fyva2alis2ejpigv1ssxz/Afterhours-Forrest-3.mp3?rlkey=6i216oplretoay5ne26cc15fg&st=ms2er2ys&dl=1",
				{
					loop: true,
					fadeIn: true,
					fadeInDuration: 5000,
					maxVolume: 0.5,
				}
			);

			// Clean up on component unmount
			return () => {
				if (audioControlRef.current) {
					audioControlRef.current.stop();
				}
			};
		}
	}, [isSunday, playBackgroundSound]);

	return (
		<PageTransition>
			{/* Background Image with Overlay */}
			<div
				className="fixed inset-0 bg-cover bg-center z-0"
				style={{
					backgroundImage:
						'url("/lovable-uploads/004b6e30-55cf-4f7e-8223-8721f1c81f50.png")',
				}}
			>
				{/* Logo in top-left corner */}
				<div className="absolute top-4 left-4 z-20">
					<Logo size="md" />
				</div>

				{/* Dark overlay */}
				<div className="absolute inset-0 bg-black/50"></div>

				{/* Vignette effect */}
				<div className="absolute inset-0 bg-[radial-gradient(circle,transparent_25%,rgba(0,0,0,0.6)_100%)]"></div>

				{/* TV Noise effect */}
				<div
					className="absolute inset-0 opacity-10 mix-blend-overlay"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
						backgroundSize: "cover",
						animation: "noise 0.2s infinite alternate",
					}}
				></div>
			</div>

			<div className="min-h-screen flex flex-col items-center justify-center relative z-10">
				<h1 className="font-bold mb-2 text-orange-600 text-center text-6xl">CLOSED</h1>
				<p className="text-white text-xl">Back on Monday</p>
				<p className="text-white text-xs mt-1 opacity-75">
					Your streak will not be lost. Relax.
				</p>

				{/* Mentor popup demonstration */}
				<MentorPopup
					isVisible={showMentor}
					content={
						<div>
							<p className="text-sm font-medium">
								Call your mum, make a roast, lay in the sun, sit with your thoughts
								in silence, read a magazine, drink a glass of Riesling, make love to
								your wife, celebrate your wins, live in the real world today. See
								you tomorrow.
							</p>
						</div>
					}
				/>
			</div>

			{/* Add animation keyframes for the noise effect */}
			<style>
				{`
        @keyframes noise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-1px, 1px); }
          20% { transform: translate(-2px, 2px); }
          30% { transform: translate(1px, -1px); }
          40% { transform: translate(2px, -2px); }
          50% { transform: translate(-1px, 2px); }
          60% { transform: translate(-2px, 1px); }
          70% { transform: translate(2px, 1px); }
          80% { transform: translate(-1px, -1px); }
          90% { transform: translate(1px, 2px); }
          100% { transform: translate(2px, -2px); }
        }
        `}
			</style>
		</PageTransition>
	);
};
export default SundayPage;
