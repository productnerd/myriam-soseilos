import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/layout/Card";
import { ScrollArea } from "@/components/ui/layout/ScrollArea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/form/Select";
import { Button } from "@/components/ui/interactive/Button";
import { Input } from "@/components/ui/form/Input";
import { Loader2, DownloadCloud, Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { AdminLog, AdminStateChange } from "@/types/admin";

const LogsTab = () => {
	const [logs, setLogs] = useState<AdminLog[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [actionTypeFilter, setActionTypeFilter] = useState<string>("");
	const [entityTypeFilter, setEntityTypeFilter] = useState<string>("");
	const [adminFilter, setAdminFilter] = useState<string>("");
	const [actionTypes, setActionTypes] = useState<string[]>([]);
	const [entityTypes, setEntityTypes] = useState<string[]>([]);
	const [adminNames, setAdminNames] = useState<{ id: string; name: string | null }[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	const fetchLogs = async (filters = {}) => {
		setIsLoading(true);
		try {
			let query = supabase.from("admin_audit_logs").select("*, profiles(name)");

			// Apply filters
			if (actionTypeFilter) {
				query = query.eq("action_type", actionTypeFilter);
			}

			if (entityTypeFilter) {
				query = query.eq("entity_type", entityTypeFilter);
			}

			if (adminFilter) {
				query = query.eq("admin_id", adminFilter);
			}

			if (searchQuery) {
				query = query.or(`details.ilike.%${searchQuery}%`);
			}

			query = query.order("created_at", { ascending: false }).limit(100);

			const { data, error } = await query;

			if (error) throw error;

			// Process the data to match AdminLog type
			const processedLogs: AdminLog[] = (data || []).map((log) => ({
				id: log.id,
				admin_id: log.admin_id,
				admin_name: log.profiles?.name || "Unknown Admin",
				action_type: log.action_type,
				entity_type: log.entity_type,
				entity_id: log.entity_id,
				details: log.details,
				created_at: log.created_at,
				previous_state: log.previous_state as AdminStateChange | null,
				new_state: log.new_state as AdminStateChange | null,
				ip_address: log.ip_address,
			}));

			setLogs(processedLogs);

			// Extract unique action types and entity types for filters
			const uniqueActionTypes = [...new Set(processedLogs.map((log) => log.action_type))];
			const uniqueEntityTypes = [...new Set(processedLogs.map((log) => log.entity_type))];
			const uniqueAdmins = [
				...new Set(
					processedLogs
						.map((log) => ({ id: log.admin_id, name: log.admin_name }))
						.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
				),
			];

			setActionTypes(uniqueActionTypes);
			setEntityTypes(uniqueEntityTypes);
			setAdminNames(uniqueAdmins);
		} catch (error) {
			console.error("Error fetching logs:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const handleSearch = () => {
		fetchLogs({
			actionType: actionTypeFilter,
			entityType: entityTypeFilter,
			adminId: adminFilter,
			query: searchQuery,
		});
	};

	const handleReset = () => {
		setActionTypeFilter("");
		setEntityTypeFilter("");
		setAdminFilter("");
		setSearchQuery("");
		fetchLogs({});
	};

	// Export logs as CSV
	const exportLogs = () => {
		if (!logs.length) return;

		const headers = ["ID", "Admin", "Action", "Entity Type", "Entity ID", "Details", "Date"];

		const csvRows = [
			headers.join(","),
			...logs.map((log) => {
				// Escape strings to handle commas
				const escapeCsv = (str: string | null) => {
					if (str === null) return "";
					return `"${String(str).replace(/"/g, '""')}"`;
				};

				return [
					escapeCsv(log.id),
					escapeCsv(log.admin_name || log.admin_id),
					escapeCsv(log.action_type),
					escapeCsv(log.entity_type),
					escapeCsv(log.entity_id),
					escapeCsv(log.details),
					escapeCsv(format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss")),
				].join(",");
			}),
		];

		const csvContent = csvRows.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");

		link.setAttribute("href", url);
		link.setAttribute("download", `admin-logs-${format(new Date(), "yyyy-MM-dd")}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const renderLogDetails = (log: AdminLog) => {
		let details = log.details || "No additional details";

		// Special handling for various log types
		switch (log.action_type) {
			case "ADD_STRIKE":
				details = `Added strike to user. Reason: ${log.details || "No reason provided"}`;
				break;
			case "SEND_MESSAGE":
				details = log.details || "Sent message to users";
				break;
			// Add more cases as you implement more logging
		}

		return details;
	};

	/**
	 * Format timestamp for audit logs with precise time information.
	 * This is different from the general formatDate utility as it includes hours, minutes, and seconds
	 * which are important for audit trail purposes.
	 */
	const formatLogTimestamp = (dateString: string) => {
		return format(new Date(dateString), "MMM d, yyyy HH:mm:ss");
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Admin Audit Logs</CardTitle>
					<CardDescription>
						View a complete history of all actions taken by administrators.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<Input
									placeholder="Search logs..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								/>
							</div>

							<div className="flex flex-1 gap-4">
								<Button onClick={handleSearch} className="flex-shrink-0">
									<Search className="h-4 w-4 mr-2" />
									Search
								</Button>

								<Button
									variant="outline"
									onClick={handleReset}
									className="flex-shrink-0"
								>
									<RefreshCw className="h-4 w-4 mr-2" />
									Reset
								</Button>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="text-sm font-medium">Filter by Action</label>
								<Select
									value={actionTypeFilter}
									onValueChange={setActionTypeFilter}
								>
									<SelectTrigger>
										<SelectValue placeholder="All actions" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All actions</SelectItem>
										{actionTypes.map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="text-sm font-medium">Filter by Entity</label>
								<Select
									value={entityTypeFilter}
									onValueChange={setEntityTypeFilter}
								>
									<SelectTrigger>
										<SelectValue placeholder="All entities" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All entities</SelectItem>
										{entityTypes.map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className="text-sm font-medium">Filter by Admin</label>
								<Select value={adminFilter} onValueChange={setAdminFilter}>
									<SelectTrigger>
										<SelectValue placeholder="All admins" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">All admins</SelectItem>
										{adminNames.map((admin) => (
											<SelectItem key={admin.id} value={admin.id}>
												{admin.name || admin.id}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex justify-end">
							<Button variant="outline" onClick={exportLogs} disabled={!logs.length}>
								<DownloadCloud className="h-4 w-4 mr-2" />
								Export Logs
							</Button>
						</div>

						{isLoading ? (
							<div className="flex justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
							</div>
						) : logs.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								No logs found. Try adjusting your filters.
							</div>
						) : (
							<ScrollArea className="h-[500px] rounded-md border">
								<div className="p-4 space-y-4">
									{logs.map((log) => (
										<div
											key={log.id}
											className="border rounded-lg p-3 space-y-2"
										>
											<div className="flex flex-wrap justify-between items-start gap-2">
												<div className="space-y-1">
													<div className="flex items-center">
														<span className="font-semibold">
															{log.action_type}
														</span>
														<span className="text-muted-foreground mx-2">
															•
														</span>
														<span className="text-sm text-muted-foreground">
															{log.entity_type}
														</span>
													</div>
													<div className="text-sm">
														<span className="text-muted-foreground">
															By:{" "}
														</span>
														<span className="font-medium">
															{log.admin_name || log.admin_id}
														</span>
													</div>
												</div>
												<div className="text-xs text-muted-foreground">
													{formatLogTimestamp(log.created_at)}
												</div>
											</div>

											<div className="text-sm">{renderLogDetails(log)}</div>

											{log.entity_id && (
												<div className="text-xs text-muted-foreground">
													Entity ID: {log.entity_id}
												</div>
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default LogsTab;
