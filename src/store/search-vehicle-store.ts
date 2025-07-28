import { create } from "zustand";
import { searchVehicleAction } from "@/lib/actions/parking/search-vehicle";
import type { SearchVehicleResponse } from "@/lib/types/parking";

type State = {
	loading: boolean;
	searchedVehicle: SearchVehicleResponse | null;
	clearCount: number;
};

type Action = {
	searchVehicle: (plate: string) => Promise<void>;
	clear: () => void;
};

export const useSearchVehicleStore = create<State & Action>((set) => ({
	loading: false,
	searchedVehicle: null,
	clearCount: 0,
	searchVehicle: async (plate) => {
		set({ loading: true });

		const response = await searchVehicleAction({ plate });

		if (response.ok) {
			set({ searchedVehicle: response.data });
		}

		set({ loading: false });
	},
	clear: () => {
		set((state) => ({
			searchedVehicle: null,
			loading: false,
			clearCount: state.clearCount + 1,
		}));
	},
}));
