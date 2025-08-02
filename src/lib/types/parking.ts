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

export interface GetActiveEntryResponse {
	id: number;
	plate: string;
	entryTime: Date;
	vehicleTypeId: number;
	vehicleTypeName: string;
	userId: string;
	userName: string;
}
