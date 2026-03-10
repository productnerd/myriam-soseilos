import { AuthUser } from "@/types/auth";
import AccessCodeInput from "./AccessCodeInput";
import { useNavigate } from "react-router-dom";

interface AccessCodeFormProps {
	user: AuthUser | null;
}

const AccessCodeForm = ({ user }: AccessCodeFormProps) => {
	const navigate = useNavigate();

	const handleValidCode = () => {
		// Redirect to onboarding with a small delay for better UX
		setTimeout(() => {
			navigate("/onboarding");
		}, 1000);
	};

	return <AccessCodeInput user={user} onValidCode={handleValidCode} />;
};

export default AccessCodeForm;
