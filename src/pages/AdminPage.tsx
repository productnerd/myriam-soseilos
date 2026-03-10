import { useState } from "react";
import { Tabs } from "@/components/ui/navigation/Tabs";
import PageTransition from "@/components/ui/PageTransition";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { AdminTabNavigation } from "@/components/admin/dashboard/AdminTabNavigation";
import { AdminTabContent } from "@/components/admin/dashboard/AdminTabContent";
import { AdminLoading } from "@/components/admin/dashboard/AdminLoading";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useUserContext } from "@/contexts/UserContext";

const AdminPage = () => {
	const { user, loading } = useUserContext();

	useAdminAccess(user!.id, user!.isAdmin);
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<string>("stats");

	if (loading) {
		return <AdminLoading />;
	}

	if (!user!.isAdmin) {
		navigate("/learn");
		return null;
	}

	return (
		<Layout>
			<PageTransition>
				<div className="container mx-auto py-8 pb-32">
					<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<AdminTabNavigation />
						<AdminTabContent activeTab={activeTab} />
					</Tabs>
				</div>
			</PageTransition>
		</Layout>
	);
};

export default AdminPage;
