import { create } from "zustand";
import { searchVehicle } from "@/lib/actions/parking/search-vehicle";
import type { SearchVehicleResponse } from "@/lib/types/parking";

type State = {
	loading: boolean;
	vehicle: SearchVehicleResponse | null;
};

type Action = {
	searchVehicle: (plate: string) => Promise<void>;
};

export const useSearchVehicleStore = create<State & Action>((set) => ({
	loading: false,
	vehicle: null,
	searchVehicle: async (plate) => {
		set({ loading: true });

		const response = await searchVehicle({ plate });

		if (response.ok) {
			set({ vehicle: response.data });
		}

		set({ loading: false });
	},
}));
