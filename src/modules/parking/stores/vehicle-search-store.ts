import { create } from "zustand";
import { searchVehicleAction } from "@/modules/parking/actions/parking-action";
import type { VehicleSearchResult } from "@/modules/parking/types/parking";

type State = {
	loading: boolean;
	lastPlate: string | null;
	vehicleSearchResult: VehicleSearchResult | null;
};

type Actions = {
	searchVehicle: (plate: string) => Promise<void>;
	reset: () => void;
};

export const useVehicleSearchStore = create<State & Actions>((set) => ({
	loading: false,
	lastPlate: null,
	vehicleSearchResult: null,

	searchVehicle: async (plate: string) => {
		set({ loading: true, lastPlate: plate });

		const result = await searchVehicleAction(plate);

		if (result.found) {
			set({
				loading: false,
				vehicleSearchResult: result,
			});
		} else {
			set({
				loading: false,
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

	reset: () => set({ vehicleSearchResult: null, lastPlate: null }),
}));
