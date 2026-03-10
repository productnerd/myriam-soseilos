import { Navigate } from "react-router-dom";

const HomePage = () => {
	// Redirect to /learn as the main page
	return <Navigate to="/learn" replace />;
};

export default HomePage;
