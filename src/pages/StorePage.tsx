import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PageTransition from "@/components/ui/PageTransition";
import ShopItemList from "@/components/shop/ShopItemList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/navigation/Tabs";
import { useShopCheckout } from "@/hooks/shop/useShopCheckout";
import { toast } from "sonner";
import { useConfettiEffect } from "@/hooks/learning/useConfettiEffect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type StoreTab = "available" | "coming_soon" | "all";

// Helper function to debounce toast notifications
const useToastDebounce = () => {
	const toastTimestamps = useRef<Record<string, number>>({});
	const showToast = (message: string, type: "success" | "error", debounceTime: number = 3000) => {
		const currentTime = Date.now();
		const lastShown = toastTimestamps.current[message] || 0;
		if (currentTime - lastShown > debounceTime) {
			toastTimestamps.current[message] = currentTime;
			if (type === "success") {
				toast.success(message);
			} else {
				toast.error(message);
			}
		}
	};
	return {
		showToast,
	};
};

const StorePage = () => {
	const [activeTab, setActiveTab] = useState<StoreTab>("available");
	const [searchParams] = useSearchParams();
	const { completeTransaction } = useShopCheckout();
	const { showToast } = useToastDebounce();
	const processedSessionRef = useRef<string | null>(null);

	// Fetch item counts to determine which tabs to show
	const { data: tabCounts, isLoading: tabCountsLoading } = useQuery({
		queryKey: ["store_item_counts"],
		queryFn: async () => {
			// Get counts of available and coming soon items
			const { data: availableCount } = await supabase
				.from("store_items")
				.select("id", {
					count: "exact",
				})
				.eq("state", "AVAILABLE")
				.eq("ishidden", false);
			const { data: comingSoonCount } = await supabase
				.from("store_items")
				.select("id", {
					count: "exact",
				})
				.eq("state", "COMING_SOON")
				.eq("ishidden", false);
			return {
				available: availableCount?.length ?? 0,
				comingSoon: comingSoonCount?.length ?? 0,
			};
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: false,
	});

	// Set the default active tab based on available items
	useEffect(() => {
		if (tabCountsLoading || !tabCounts) return;

		// If there are no available items, switch to coming soon tab
		if (activeTab === "available" && tabCounts.available === 0) {
			if (tabCounts.comingSoon > 0) {
				setActiveTab("coming_soon");
			} else {
				setActiveTab("all");
			}
		}
		// If there are no coming soon items and we're on that tab, switch to available or all
		else if (activeTab === "coming_soon" && tabCounts.comingSoon === 0) {
			if (tabCounts.available > 0) {
				setActiveTab("available");
			} else {
				setActiveTab("all");
			}
		}
	}, [tabCounts, tabCountsLoading, activeTab]);

	// Check for transaction completion
	useEffect(() => {
		const transactionStatus = searchParams.get("transaction");
		const sessionId = searchParams.get("session");
		if (
			transactionStatus === "success" &&
			sessionId &&
			processedSessionRef.current !== sessionId
		) {
			processedSessionRef.current = sessionId;
			handleTransactionCompletion(sessionId);
		} else if (transactionStatus === "canceled" && processedSessionRef.current !== "canceled") {
			processedSessionRef.current = "canceled";
			showToast("Transaction was canceled", "error");
		}
	}, [searchParams, showToast]);

	const handleTransactionCompletion = async (sessionId: string) => {
		const result = await completeTransaction(sessionId);
		if (result.success) {
			showToast("Purchase completed successfully!", "success");
			// Trigger confetti effect
			useConfettiEffect();
		} else {
			showToast("Failed to complete transaction", "error");
		}
	};

	const hasAvailableTab = !tabCounts || tabCounts.available > 0;
	const hasComingSoonTab = !tabCounts || tabCounts.comingSoon > 0;

	return (
		<PageTransition>
			<div className="container pb-24 mx-auto">
				<div className="sticky top-6 z-30 bg-background/95 backdrop-blur-md border-b border-border/20 pt-0.5 pb-4">
					<div className="flex items-center justify-between mb-1 relative">
						{/* Position CLOSED tag behind the heading */}
						<div className="relative">
							<div className="absolute -top-4 -left-1 z-0">
								<div className="bg-red-600 text-white font-bold py-1 px-6 rounded-md shadow-md transform -rotate-3">
									CLOSED
								</div>
							</div>
							<h3 className="pt-3 relative z-10 font-bold text-2xl">
								The Corner Store
							</h3>
						</div>
						<Tabs
							defaultValue={
								hasAvailableTab
									? "available"
									: hasComingSoonTab
									? "coming_soon"
									: "all"
							}
							value={activeTab}
							onValueChange={(value) => setActiveTab(value as StoreTab)}
						>
							<TabsList>
								{hasAvailableTab && (
									<TabsTrigger
										value="available"
										className="text-xs uppercase tracking-wide"
									>
										AVAILABLE
									</TabsTrigger>
								)}
								{hasComingSoonTab && (
									<TabsTrigger
										value="coming_soon"
										className="text-xs uppercase tracking-wide"
									>
										COMING SOON
									</TabsTrigger>
								)}
								<TabsTrigger
									value="all"
									className="text-xs uppercase tracking-wide"
								>
									ALL
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</div>

				<div className="mt-6">
					<ShopItemList filterStatus={activeTab} />
				</div>
			</div>
		</PageTransition>
	);
};

export default StorePage;
