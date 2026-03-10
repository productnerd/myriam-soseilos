import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TopicStore, FlowStore, UserStore } from "@/types/store";
import { supabase } from "@/integrations/supabase/client";

export const createFlowStore: StateCreator<FlowStore> = (set) => ({
	flowPoints: 0,
	isLoading: false,
	setFlowPoints: (points) => set({ flowPoints: points }),
	setIsLoading: (loading) => set({ isLoading: loading }),
	syncFlowPoints: async (userId: string | null) => {
		set({ isLoading: true });
		if (!userId) {
			set({ flowPoints: null, isLoading: false });
			return;
		}
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("flow_balance")
				.eq("id", userId)
				.single();
			if (error) {
				set({ flowPoints: null, isLoading: false });
			} else {
				set({ flowPoints: data?.flow_balance || 0, isLoading: false });
			}
		} catch (e) {
			set({ flowPoints: null, isLoading: false });
		}
	},
});

export const createUserStore: StateCreator<UserStore> = (set) => ({
	hasCompletedInitialTest: false,
	setHasCompletedInitialTest: (hasCompleteInitialTest) =>
		set({ hasCompletedInitialTest: hasCompleteInitialTest }),
});

export type Stores = FlowStore & UserStore;

export const useBoundStore = create<Stores>()(
	persist(
		(...setGetStores) => ({
			...createFlowStore(...setGetStores),
			...createUserStore(...setGetStores),
		}),
		{
			name: "bound-app-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				flowPoints: state.flowPoints,
				hasCompletedInitialTest: state.hasCompletedInitialTest,
			}),
		}
	)
);
