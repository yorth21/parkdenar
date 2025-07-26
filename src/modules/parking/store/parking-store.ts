import { create } from "zustand";

interface FoundVehicle {
	plate: string;
	entryTime: Date;
	vehicleType: string;
	timeParked: string;
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
	registerEntry: () => Promise<void>;
	registerExit: () => Promise<void>;
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

		try {
			const response = await fetch("/api/parking/search", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ plate: searchPlate.trim() }),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Error al buscar vehículo");
			}

			if (result.found) {
				const foundVehicle: FoundVehicle = {
					plate: result.data.plate,
					entryTime: new Date(result.data.entryTime),
					vehicleType: result.data.vehicleType,
					timeParked: result.data.timeParked,
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
		} catch (error) {
			console.error("Error buscando vehículo:", error);
			set({
				searchResult: "not_found",
				foundVehicle: null,
				isSearching: false,
			});
		}
	},

	registerEntry: async () => {
		const { searchPlate, vehicleType } = get();
		if (!searchPlate.trim() || !vehicleType) return;

		try {
			// Necesitamos el vehicleTypeId, por ahora usamos un mapeo simple
			const vehicleTypeMap: Record<string, number> = {
				Carro: 1,
				Moto: 2,
				Bicicleta: 3,
			};

			const vehicleTypeId = 3;
			if (!vehicleTypeId) {
				throw new Error("Tipo de vehículo no válido");
			}

			const response = await fetch("/api/parking/entry", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plate: searchPlate.trim(),
					vehicleTypeId,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Error al registrar entrada");
			}

			console.log("Entrada registrada exitosamente:", result);
			get().resetForm();
		} catch (error) {
			console.error("Error registrando entrada:", error);
			// TODO: Mostrar toast/mensaje de error al usuario
		}
	},

	registerExit: async () => {
		const { foundVehicle } = get();
		if (!foundVehicle) return;

		try {
			const response = await fetch("/api/parking/exit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					plate: foundVehicle.plate,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Error al registrar salida");
			}

			console.log("Salida registrada exitosamente:", result);
			console.log(`Monto a cobrar: $${result.data.amount.toLocaleString()}`);
			get().resetForm();
		} catch (error) {
			console.error("Error registrando salida:", error);
			// TODO: Mostrar toast/mensaje de error al usuario
		}
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
