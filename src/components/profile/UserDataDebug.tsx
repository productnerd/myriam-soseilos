import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { getUserData } from "@/utils/user/userDataQuery";
import { Separator } from "@/components/ui/layout/Separator";

const UserDataDebug = () => {
	const [email, setEmail] = useState("mariatechmaniac@yahoo.com");
	const [userData, setUserData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleQuery = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getUserData(email);
			setUserData(data);
			if (!data) {
				setError("No user found with this email");
			}
		} catch (err: any) {
			setError(err.message || "An error occurred");
			console.error("Error querying user data:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		handleQuery();
	}, []);

	return (
		<Card className="mt-8">
			<CardHeader>
				<CardTitle>User Data Debug</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex gap-2 mb-4">
					<Input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter email to query"
						className="flex-1"
					/>
					<Button onClick={handleQuery} disabled={isLoading}>
						{isLoading ? "Loading..." : "Query"}
					</Button>
				</div>

				{error && <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4">{error}</div>}

				{userData && (
					<div className="bg-gray-50 p-4 rounded-md">
						<h3 className="font-semibold mb-2">User ID: {userData.id}</h3>

						<div className="mb-3">
							<h4 className="font-medium">Tags:</h4>
							{userData.tags && userData.tags.length > 0 ? (
								<div className="flex flex-wrap gap-2 mt-1">
									{userData.tags.map((tag: string, i: number) => (
										<span
											key={i}
											className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
										>
											{tag}
										</span>
									))}
								</div>
							) : (
								<p className="text-sm text-gray-500">No tags found</p>
							)}
						</div>

						<Separator className="my-3" />

						<div className="mb-3">
							<h4 className="font-medium">Access Code ID (UUID):</h4>
							{userData.accessCodeId ? (
								<p className="font-mono bg-gray-100 p-2 rounded mt-1 text-sm overflow-auto">
									{userData.accessCodeId}
								</p>
							) : (
								<p className="text-sm text-gray-500">No access code ID found</p>
							)}
						</div>

						<div className="mb-3">
							<h4 className="font-medium">Access Code:</h4>
							{userData.accessCode ? (
								<p className="font-mono bg-gray-100 p-2 rounded mt-1">
									{userData.accessCode}
								</p>
							) : (
								<p className="text-sm text-gray-500">No access code found</p>
							)}
						</div>

						<div className="mb-3">
							<h4 className="font-medium">Access Code Description:</h4>
							{userData.accessCodeDescription ? (
								<p className="bg-gray-100 p-2 rounded mt-1">
									{userData.accessCodeDescription}
								</p>
							) : (
								<p className="text-sm text-gray-500">No description found</p>
							)}
						</div>

						{userData.rls_error && (
							<div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
								<h4 className="font-medium">RLS Policy Issue Detected:</h4>
								<p className="mt-1 text-sm">{userData.rls_error}</p>
								<p className="mt-2 text-xs">
									To fix this, you need to add a Row Level Security policy to
									allow access to the access_codes table.
								</p>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default UserDataDebug;
