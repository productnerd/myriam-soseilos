import React, { useState } from "react";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Search, User } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";

type UserStrikeResult = {
	id: string;
	email: string | null;
	name: string | null;
	thumbnail: string | null;
	strikes: number;
};

const UserStrikesTab: React.FC = () => {
	const { user } = useUserContext();
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [foundUser, setFoundUser] = useState<UserStrikeResult | null>(null);
	const [isAddingStrike, setIsAddingStrike] = useState<boolean>(false);
	const [reason, setReason] = useState<string>("");

	// Search for a user by email or UUID
	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			toast.error("Please enter an email or user ID");
			return;
		}

		setIsSearching(true);
		setFoundUser(null);

		try {
			// Check if the query looks like a UUID
			const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
				searchQuery
			);

			// Query the profiles table
			const { data, error } = await supabase
				.from("profiles")
				.select("id, email, name, thumbnail, strikes")
				.or(isUuid ? `id.eq.${searchQuery}` : `email.ilike.%${searchQuery}%`)
				.limit(1);

			if (error) throw error;

			if (data && data.length > 0) {
				setFoundUser(data[0]);
			} else {
				toast.error("User not found");
			}
		} catch (error) {
			console.error("Error searching for user:", error);
			toast.error("Failed to search for user");
		} finally {
			setIsSearching(false);
		}
	};

	// Add a strike to the user
	const handleAddStrike = async () => {
		if (!foundUser) return;

		setIsAddingStrike(true);

		try {
			// Get previous state for audit log
			const previousState = {
				strikes: foundUser.strikes,
			};

			// Update the user's strikes count
			const { data, error } = await supabase
				.from("profiles")
				.update({
					strikes: (foundUser.strikes || 0) + 1,
				})
				.eq("id", foundUser.id)
				.select("strikes");

			if (error) throw error;

			// Create a record in the admin audit logs
			const newState = {
				strikes: (foundUser.strikes || 0) + 1,
			};

			// Log the admin action
			const { error: logError } = await supabase
				.from("admin_audit_logs")
				.insert({
					admin_id: user!.id,
					action_type: "ADD_STRIKE",
					entity_type: "USER",
					entity_id: foundUser.id,
					previous_state: previousState,
					new_state: newState,
					details: reason || "No reason provided",
				})
				.select();

			if (logError) {
				console.error("Error logging admin action:", logError);
			}

			// Update the local state
			if (data && data.length > 0) {
				setFoundUser({ ...foundUser, strikes: data[0].strikes });
				toast.success(`Strike added to user ${foundUser.email || foundUser.id}`, {
					description: reason ? `Reason: ${reason}` : undefined,
				});
				setReason("");
			}
		} catch (error) {
			console.error("Error adding strike:", error);
			toast.error("Failed to add strike");
		} finally {
			setIsAddingStrike(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>User Strikes</CardTitle>
					<CardDescription>
						Add strikes to users who have violated platform rules. Users with too many
						strikes may be banned.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex gap-2">
							<Input
								placeholder="Enter user email or UUID"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1"
							/>
							<Button onClick={handleSearch} disabled={isSearching}>
								{isSearching ? (
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
								) : (
									<Search className="h-4 w-4 mr-2" />
								)}
								Search
							</Button>
						</div>

						{foundUser && (
							<div className="border rounded-md p-4 space-y-4">
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
										{foundUser.thumbnail ? (
											<img
												src={foundUser.thumbnail}
												alt={foundUser.name || "User"}
												className="h-full w-full object-cover"
											/>
										) : (
											<User className="h-6 w-6 text-muted-foreground" />
										)}
									</div>
									<div>
										<h3 className="font-medium">
											{foundUser.name || "Unnamed User"}
										</h3>
										<p className="text-sm text-muted-foreground">
											{foundUser.email || foundUser.id}
										</p>
										<div className="flex items-center mt-1">
											<AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
											<span className="text-sm font-medium">
												{foundUser.strikes || 0} Strikes
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium">
										Reason for strike (optional, for admin records)
									</label>
									<Input
										placeholder="e.g., Used AI-generated images for quest submissions"
										value={reason}
										onChange={(e) => setReason(e.target.value)}
									/>
								</div>

								<Button
									variant="destructive"
									onClick={handleAddStrike}
									disabled={isAddingStrike}
									className="w-full"
								>
									{isAddingStrike ? (
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
									) : (
										<AlertTriangle className="h-4 w-4 mr-2" />
									)}
									Add Strike
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default UserStrikesTab;
