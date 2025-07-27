import { create } from "zustand";
import { searchVehicleAction } from "@/modules/parking/actions/parking-actions";
import type { VehicleSearchResult } from "@/modules/parking/types/parking";

type State = {
	vehicleSearchResult: VehicleSearchResult | null;
};

type Actions = {
	searchVehicle: (plate: string) => Promise<void>;
	reset: () => void;
};

export const useVehicleSearchStore = create<State & Actions>((set) => ({
	vehicleSearchResult: null,

	searchVehicle: async (plate: string) => {
		const result = await searchVehicleAction(plate);

		if (result.found) {
			set({ vehicleSearchResult: result });
		} else {
			set({
				vehicleSearchResult: {
					found: false,
					data: {
						plate: "",
						vehicleType: "",
						entryTime: new Date(),
						timeParked: "",
					},
				},
			});
		}
	},

	reset: () => set({ vehicleSearchResult: null }),
}));
