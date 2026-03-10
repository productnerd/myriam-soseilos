import { Link } from "react-router-dom";
import { Button } from "@/components/ui/interactive/Button";
import PageTransition from "@/components/ui/PageTransition";

const NotFoundPage = () => {
	return (
		<PageTransition>
			<div className="container mx-auto py-16 flex flex-col items-center justify-center text-center">
				<h1 className="text-4xl font-bold mb-4">404</h1>
				<p className="text-xl mb-8">Oops! Page not found</p>
				<p className="mb-8 text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Button asChild>
					<Link to="/learn">Go back to learning</Link>
				</Button>
			</div>
		</PageTransition>
	);
};

export default NotFoundPage;
