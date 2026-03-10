import { useState } from "react";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Label } from "@/components/ui/form/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Textarea } from "@/components/ui/form/Textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AwardDarkTab = () => {
	const [userIdentifier, setUserIdentifier] = useState("");
	const [darkPoints, setDarkPoints] = useState("");
	const [reason, setReason] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleAwardDarkPoints = async () => {
		if (!userIdentifier || !darkPoints) {
			toast.error("Please fill in all required fields");
			return;
		}

		const pointsToAward = parseInt(darkPoints);
		if (isNaN(pointsToAward) || pointsToAward <= 0) {
			toast.error("Please enter a valid number of points");
			return;
		}

		setIsLoading(true);

		try {
			// First, find the user by email or name
			const { data: users, error: searchError } = await supabase
				.from("profiles")
				.select("id, name, email, dark_points")
				.or(`email.ilike.%${userIdentifier}%,name.ilike.%${userIdentifier}%`);

			if (searchError) {
				throw searchError;
			}

			if (!users || users.length === 0) {
				toast.error("User not found");
				return;
			}

			if (users.length > 1) {
				toast.error("Multiple users found. Please be more specific");
				return;
			}

			const user = users[0];

			// Update the user's dark points
			const { error: updateError } = await supabase
				.from("profiles")
				.update({
					dark_points: (user.dark_points || 0) + pointsToAward,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}

			// Log the transaction
			const { error: transactionError } = await supabase.from("user_transactions").insert({
				user_id: user.id,
				dark_points: pointsToAward,
				details: `Admin awarded: ${reason || "No reason provided"}`,
			});

			if (transactionError) {
				console.warn("Failed to log transaction:", transactionError);
			}

			toast.success(
				`Successfully awarded ${pointsToAward} dark points to ${user.name || user.email}`
			);

			// Reset form
			setUserIdentifier("");
			setDarkPoints("");
			setReason("");
		} catch (error) {
			console.error("Error awarding dark points:", error);
			toast.error("Failed to award dark points");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Award Dark Points</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="userIdentifier">User Email or Name</Label>
						<Input
							id="userIdentifier"
							type="text"
							placeholder="Enter user email or name"
							value={userIdentifier}
							onChange={(e) => setUserIdentifier(e.target.value)}
						/>
					</div>

					<div>
						<Label htmlFor="darkPoints">Dark Points to Award</Label>
						<Input
							id="darkPoints"
							type="number"
							placeholder="Enter number of points"
							value={darkPoints}
							onChange={(e) => setDarkPoints(e.target.value)}
							min="1"
							max="30"
						/>
					</div>

					<div>
						<Label htmlFor="reason">Reason (Optional)</Label>
						<Textarea
							id="reason"
							placeholder="Enter reason for awarding points"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
						/>
					</div>

					<Button onClick={handleAwardDarkPoints} disabled={isLoading}>
						{isLoading ? "Awarding..." : "Award Dark Points"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default AwardDarkTab;
