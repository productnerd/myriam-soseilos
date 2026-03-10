import React from "react";

interface InviteHeaderProps {
	inviterName: string | null;
	loading: boolean;
	error: string | null;
}

const InviteHeader: React.FC<InviteHeaderProps> = ({ inviterName, loading, error }) => {
	return (
		<div className="mb-6 text-center">
			{loading ? (
				<h1 className="text-2xl font-bold mb-2">Loading invitation details...</h1>
			) : error ? (
				<div className="text-red-500">
					<h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
					<p>{error}</p>
				</div>
			) : (
				<h1 className="text-2xl font-bold mb-2">{inviterName}'s Invitation</h1>
			)}
		</div>
	);
};

export default InviteHeader;
