import { create } from "zustand";

interface FoundVehicle {
	plate: string;
	entryTime: string;
	type: string;
}

interface ParkingState {
	// Search state
	searchPlate: string;
	isSearching: boolean;
	searchResult: "found" | "not_found" | null;

	// Vehicle data
	foundVehicle: FoundVehicle | null;
	vehicleType: string;

	// Actions
	setSearchPlate: (plate: string) => void;
	setIsSearching: (searching: boolean) => void;
	setSearchResult: (result: "found" | "not_found" | null) => void;
	setFoundVehicle: (vehicle: FoundVehicle | null) => void;
	setVehicleType: (type: string) => void;

	// Business logic
	searchVehicle: () => Promise<void>;
	registerEntry: () => void;
	registerExit: () => void;
	resetForm: () => void;
}

export const useParkingStore = create<ParkingState>((set, get) => ({
	// Initial state
	searchPlate: "",
	isSearching: false,
	searchResult: null,
	foundVehicle: null,
	vehicleType: "",

	// Basic setters
	setSearchPlate: (plate) => set({ searchPlate: plate }),
	setIsSearching: (searching) => set({ isSearching: searching }),
	setSearchResult: (result) => set({ searchResult: result }),
	setFoundVehicle: (vehicle) => set({ foundVehicle: vehicle }),
	setVehicleType: (type) => set({ vehicleType: type }),

	// Business logic
	searchVehicle: async () => {
		const { searchPlate } = get();
		if (!searchPlate.trim()) return;

		set({
			isSearching: true,
			searchResult: null,
			vehicleType: "",
		});

		// Simulate API call
		setTimeout(() => {
			const isVehicleFound = Math.random() > 0.5;

			if (isVehicleFound) {
				const foundVehicle: FoundVehicle = {
					plate: searchPlate,
					entryTime: new Date(Date.now() - 3600 * 1000).toLocaleString(),
					type: "Carro",
				};

				set({
					foundVehicle,
					searchResult: "found",
					isSearching: false,
				});
			} else {
				set({
					searchResult: "not_found",
					foundVehicle: null,
					isSearching: false,
				});
			}
		}, 1000);
	},

	registerEntry: () => {
		const { searchPlate, vehicleType } = get();
		if (!searchPlate.trim() || !vehicleType) return;

		console.log(
			`Registrando entrada para: ${searchPlate}, Tipo: ${vehicleType}`,
		);
		get().resetForm();
	},

	registerExit: () => {
		const { foundVehicle } = get();
		if (!foundVehicle) return;

		console.log(`Registrando salida para placa: ${foundVehicle.plate}`);
		get().resetForm();
	},

	resetForm: () => {
		set({
			searchPlate: "",
			searchResult: null,
			vehicleType: "",
			foundVehicle: null,
		});
	},
}));
