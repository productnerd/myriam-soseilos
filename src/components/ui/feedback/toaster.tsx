import { useToast } from "@/hooks/ui/useToast";
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/feedback/Toast";

export function Toaster() {
	const { toasts } = useToast();

	// Group toasts by position
	const topRightToasts = toasts.filter((toast) => toast.position === "top-right");
	const topCenterToasts = toasts.filter((toast) => toast.position === "top-center");
	const bottomRightToasts = toasts.filter(
		(toast) => toast.position === "bottom-right" || !toast.position
	);

	return (
		<ToastProvider>
			{/* Top-right viewport */}
			{topRightToasts.length > 0 && (
				<ToastViewport
					className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-0 sm:right-0 sm:bottom-auto sm:flex-col md:max-w-[420px]"
					data-position="top-right"
				>
					{topRightToasts.map(function ({
						id,
						title,
						description,
						action,
						icon: Icon,
						iconProps,
						...props
					}) {
						return (
							<Toast
								key={id}
								{...props}
								className={`${
									props.className || ""
								} data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full`}
							>
								{Icon && (
									<div className="flex-shrink-0">
										<Icon
											{...iconProps}
											className={`h-6 w-6 ${iconProps?.className || ""}`}
										/>
									</div>
								)}
								<div className="grid gap-1 flex-1">
									{title && <ToastTitle>{title}</ToastTitle>}
									{description && (
										<ToastDescription>{description}</ToastDescription>
									)}
								</div>
								{action}
								<ToastClose />
							</Toast>
						);
					})}
				</ToastViewport>
			)}

			{/* Top-center viewport */}
			{topCenterToasts.length > 0 && (
				<ToastViewport
					className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-0 sm:bottom-auto sm:flex-col md:max-w-[420px]"
					data-position="top-center"
				>
					{topCenterToasts.map(function ({
						id,
						title,
						description,
						action,
						icon: Icon,
						iconProps,
						...props
					}) {
						return (
							<Toast
								key={id}
								{...props}
								className={`${
									props.className || ""
								} data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full`}
							>
								{Icon && (
									<div className="flex-shrink-0">
										<Icon
											{...iconProps}
											className={`h-6 w-6 ${iconProps?.className || ""}`}
										/>
									</div>
								)}
								<div className="grid gap-1 flex-1">
									{title && <ToastTitle>{title}</ToastTitle>}
									{description && (
										<ToastDescription>{description}</ToastDescription>
									)}
								</div>
								{action}
								<ToastClose />
							</Toast>
						);
					})}
				</ToastViewport>
			)}

			{/* Bottom-right viewport (default) */}
			<ToastViewport
				className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
				data-position="bottom-right"
			>
				{bottomRightToasts.map(function ({
					id,
					title,
					description,
					action,
					icon: Icon,
					iconProps,
					...props
				}) {
					return (
						<Toast
							key={id}
							{...props}
							className={`${
								props.className || ""
							} data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full`}
						>
							{Icon && (
								<div className="flex-shrink-0">
									<Icon
										{...iconProps}
										className={`h-6 w-6 ${iconProps?.className || ""}`}
									/>
								</div>
							)}
							<div className="grid gap-1 flex-1">
								{title && <ToastTitle>{title}</ToastTitle>}
								{description && <ToastDescription>{description}</ToastDescription>}
							</div>
							{action}
							<ToastClose />
						</Toast>
					);
				})}
			</ToastViewport>
		</ToastProvider>
	);
}
