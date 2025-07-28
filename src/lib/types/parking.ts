import type { ParkingEntry, ParkingExit } from "@/lib/types/parking-schema";

export interface SearchVehicleRequest {
	plate: string;
}

export interface SearchVehicleResponse {
	found: boolean;
	plate?: string;
	vehicle: {
		vehicleType: string;
		entryTime: Date;
		timeParked: string;
	} | null;
}

export interface CreateEntryRequest {
	plate: string;
	vehicleTypeId: number;
	userId: string;
}

export interface CreateEntryResponse {
	entry: ParkingEntry;
}

export interface ParkingChargeDetail {
	chargeName: string;
	amount: number;
}

export interface ParkingCalculationResult {
	totalAmount: number;
	charges: ParkingChargeDetail[];
}

export interface CreateExitRequest {
	plate: string;
	userId: string;
}

export interface CreateExitResponse {
	exit: ParkingExit;
	totalAmount: number;
	charges: ParkingChargeDetail[];
}
// TODO: Example types for parking
/*// Tipos para las acciones de parking
import type { ParkingEntry, VehicleType } from "./database";

// Request/Response types para parking
export interface SearchVehicleRequest {
	plate: string;
}

export interface SearchVehicleResponse {
	ok: boolean;
	data?: {
		found: boolean;
		entry: ParkingEntryWithVehicleType | null;
	};
	error?: unknown;
}

export interface CreateEntryRequest {
	plate: string;
	vehicleTypeId: number;
	userId: string;
}

export interface CreateEntryResponse {
	ok: boolean;
	data?: {
		entry: ParkingEntry;
	};
	error?: unknown;
}

export interface CreateExitRequest {
	entryId: number;
	userId: string;
}

export interface CreateExitResponse {
	ok: boolean;
	data?: {
		exit: ParkingExitWithEntry;
		timeParked: string;
		totalAmount: number;
	};
	error?: unknown;
}

// Tipos extendidos para casos de uso específicos
export interface ParkingEntryWithVehicleType extends ParkingEntry {
	vehicleType: VehicleType;
}

export interface ParkingExitWithEntry {
	id: number;
	entryId: number;
	userId: string;
	exitTime: Date;
	calculatedAmount: number;
	status: "Paid" | "NotPaid" | "Voided";
	entry: ParkingEntry;
}
*/
