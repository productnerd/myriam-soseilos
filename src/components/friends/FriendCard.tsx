import React from "react";
import { Card, CardContent } from "@/components/ui/layout/Card";
import { Button } from "@/components/ui/interactive/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { UserMinus, UserPlus } from "lucide-react";
import { Friend } from "@/types/friends";
import { pointTypes } from "@/lib/ui";
import { Badge } from "@/components/ui/data/Badge";
import { getAvatarFallback } from "@/utils/ui/avatarUtils";

interface FriendCardProps {
	friend: Friend;
	onRemove: (id: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onRemove }) => {
	const { grey, dark, streak } = pointTypes;

	return (
		<Card className="glass hover:shadow-md transition-all">
			<CardContent className="p-4">
				{/* Mobile Layout */}
				<div className="md:hidden">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center gap-3 flex-1 min-w-0">
							<Avatar className="h-10 w-10 border border-app-blue flex-shrink-0">
								<AvatarImage
									src={friend.thumbnail || ""}
									alt={friend.name || "Friend"}
									loading="lazy"
								/>
								<AvatarFallback className="bg-app-blue text-white">
									{getAvatarFallback(friend.name, friend.email)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<p className="font-semibold truncate">
										{friend.name || "Friend"}
									</p>

									<Button
										variant="ghost"
										size="icon"
										className="text-gray-500 hover:text-red-500 h-6 w-6 flex-shrink-0"
										onClick={() => onRemove(friend.id)}
									>
										<UserMinus className="h-4 w-4" />
									</Button>

									{friend.invited && (
										<Badge
											variant="outline"
											className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex-shrink-0"
										>
											<UserPlus className="h-3 w-3 mr-1" /> Invited
										</Badge>
									)}
								</div>

								<p className="text-xs text-gray-500 truncate mb-2">
									{friend.email || "No email"}
								</p>

								<div className="flex items-center gap-2">
									{(friend.flag || friend.favorite_emoji) && (
										<div className="flex items-center gap-1">
											{friend.flag && (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800">
													{friend.flag}
												</span>
											)}
											{friend.favorite_emoji && (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800">
													{friend.favorite_emoji}
												</span>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Stats row for mobile - right aligned */}
					<div className="flex items-center justify-end gap-2">
						<div
							className={`flex items-center ${grey.bgDark} px-2 py-1 rounded-full backdrop-blur-sm border ${grey.borderDark}`}
						>
							<grey.icon className={`w-3 h-3 ${grey.textColor} mr-1`} />
							<span className="text-xs font-medium text-white">
								{friend.grey_points || 0}
							</span>
						</div>
						<div
							className={`flex items-center ${dark.bgDark} px-2 py-1 rounded-full backdrop-blur-sm border ${dark.borderDark}`}
						>
							<dark.icon className={`w-3 h-3 ${dark.textColor} mr-1`} />
							<span className="text-xs font-medium text-white">
								{friend.dark_points || 0}
							</span>
						</div>
						<div
							className={`flex items-center ${streak.bgDark} px-2 py-1 rounded-full backdrop-blur-sm border ${streak.borderDark}`}
						>
							<streak.icon className={`w-3 h-3 ${streak.textColor} mr-1`} />
							<span className="text-xs font-medium text-white">
								{friend.streak || 0}
							</span>
						</div>
					</div>
				</div>

				{/* Desktop Layout */}
				<div className="hidden md:flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10 border border-app-blue">
							<AvatarImage
								src={friend.thumbnail || ""}
								alt={friend.name || "Friend"}
								loading="lazy"
							/>
							<AvatarFallback className="bg-app-blue text-white">
								{getAvatarFallback(friend.name, friend.email)}
							</AvatarFallback>
						</Avatar>

						<div>
							<div className="flex items-center gap-2">
								<p className="font-semibold">{friend.name || "Friend"}</p>

								{friend.invited && (
									<Badge
										variant="outline"
										className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
									>
										<UserPlus className="h-3 w-3 mr-1" /> Invited by you
									</Badge>
								)}

								{friend.flag && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800">
										{friend.flag}
									</span>
								)}

								{friend.favorite_emoji && (
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800">
										{friend.favorite_emoji}
									</span>
								)}
							</div>
							<p className="text-sm text-gray-500">{friend.email || "No email"}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div
								className={`flex items-center ${grey.bgDark} px-2 py-1 rounded-full backdrop-blur-sm border ${grey.borderDark}`}
							>
								<grey.icon className={`w-3 h-3 ${grey.textColor} mr-1`} />
								<span className="text-xs font-medium text-white">
									{friend.grey_points || 0}
								</span>
							</div>
							<div
								className={`flex items-center ${dark.bgDark} px-2 py-1 rounded-full backdrop-blur-sm border ${dark.borderDark}`}
							>
								<dark.icon className={`w-3 h-3 ${dark.textColor} mr-1`} />
								<span className="text-xs font-medium text-white">
									{friend.dark_points || 0}
								</span>
							</div>
							<div
								className={`flex items-center ${streak.bgDark} px-2 py-1 rounded-full backdrop-blur-sm border ${streak.borderDark}`}
							>
								<streak.icon className={`w-3 h-3 ${streak.textColor} mr-1`} />
								<span className="text-xs font-medium text-white">
									{friend.streak || 0}
								</span>
							</div>
						</div>

						<Button
							variant="ghost"
							size="icon"
							className="text-gray-500 hover:text-red-500"
							onClick={() => onRemove(friend.id)}
						>
							<UserMinus className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default FriendCard;
