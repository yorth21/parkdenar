import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getVehicleTypesAction } from "@/lib/actions/settings/get-vehicle-types";
import type { VehicleType } from "@/lib/types/parking-schema";

type State = {
	vehicleTypes: VehicleType[];
	loading: boolean;
	expiresAt: number | null;
	error: string | null;
};

type Action = {
	fetchVehicleTypes: () => Promise<void>;
	clear: () => void;
};

const EXPIRE_MINUTES = 15; // expira en 15 minutos

export const useVehicleTypesStore = create<State & Action>()(
	persist(
		(set, get) => ({
			vehicleTypes: [],
			loading: false,
			expiresAt: null,
			error: null,
			fetchVehicleTypes: async () => {
				const now = Date.now();
				const expiresAt = get().expiresAt;
				// Si no ha expirado, no vuelve a fetch

				if (get().vehicleTypes.length > 0 && expiresAt && now < expiresAt) {
					return;
				}
				set({ loading: true });
				const vehicleTypes = await getVehicleTypesAction();
				if (!vehicleTypes.ok) {
					set({ loading: false });
					set({ error: vehicleTypes.error });
					return;
				}
				set({
					vehicleTypes: vehicleTypes.data,
					expiresAt: now + EXPIRE_MINUTES * 60 * 1000,
					loading: false,
				});
			},
			clear: () => set({ vehicleTypes: [], expiresAt: null, error: null }),
		}),
		{
			name: "vehicle-types-store",
		},
	),
);
