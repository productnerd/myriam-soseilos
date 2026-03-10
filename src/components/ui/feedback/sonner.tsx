
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: "group toast group-[.toaster]:backdrop-blur-md group-[.toaster]:bg-white/10 group-[.toaster]:border group-[.toaster]:border-white/20 group-[.toaster]:text-white group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-6 group-[.toaster]:flex group-[.toaster]:gap-4 group-[.toaster]:items-center",
					description: "group-[.toast]:text-white/90 group-[.toast]:mt-1",
					actionButton:
						"group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:border group-[.toast]:border-white/30 group-[.toast]:backdrop-blur-sm",
					cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white/80 group-[.toast]:border group-[.toast]:border-white/20",
					title: "group-[.toast]:font-semibold group-[.toast]:text-white",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
